import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { BehaviorSubject, forkJoin, of, Subject } from "rxjs";
import { take, takeUntil, filter } from "rxjs/operators";
import {
    IAsset, ICompiledData, ICompiledOrder, ICompiledOrderData, ICompiledOrderType, ICompiledProduct, ICurrency, IEQueueTheme,
    ITerminal,
    RefTypes
} from "@djonnyx/tornado-types";
import { IAssetsStoreResult } from "@djonnyx/tornado-assets-store";
import { DataCombiner as MenuDataCombiner } from "@djonnyx/tornado-refs-processor";
import { DataCombiner as OrderDataCombiner } from "@djonnyx/tornado-order-refs-processor";
import { config } from "../Config";
import { assetsService, orderApiService, refApiService } from "../services";
import { IAppState } from "../store/state";
import { CombinedDataActions, CapabilitiesActions, OrdersActions } from "../store/actions";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";
import { CapabilitiesSelectors, OrdersSelectors, SystemSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";
import { compileThemes, embededTheme, THEMES_FILE_NAME } from "../theme";
import { ExternalStorage } from "../native";

interface IDataCollectorServiceProps {
    // store
    _onChangeOrders: (data: ICompiledOrderData, version: number) => void;
    _onChangeThemes: (theme: IEQueueTheme) => void;
    _onChangeTerminal: (terminal: ITerminal) => void;
    _onChangeMenu: (data: ICompiledData) => void;
    _onProgress: (progress: IProgress) => void;

    // self
    _version?: number;
    _serialNumber?: string | undefined;
    _storeId?: string | undefined;
    _terminalId?: string | undefined;
    _currentScreen?: string | undefined;
    _orders?: Array<ICompiledOrder>;
}

interface IDataCollectorServiceState { }

class DataCollectorServiceContainer extends Component<IDataCollectorServiceProps, IDataCollectorServiceState> {
    private _unsubscribe$: Subject<void> | null = new Subject<void>();

    private _menuDataCombiner: MenuDataCombiner | null = null;

    private _orderDataCombiner: OrderDataCombiner | null = null;

    private _isLoadingStarted = false;

    private _serialNumber$ = new BehaviorSubject<string | undefined>(undefined);
    public readonly serialNumber$ = this._serialNumber$.asObservable();

    private _version$ = new BehaviorSubject<number | undefined>(undefined);
    public readonly version$ = this._version$.asObservable();

    private _menuRefs: ICompiledData | null = null;

    constructor(props: IDataCollectorServiceProps) {
        super(props);
    }

    async componentDidMount() {
        let userDataPath: string | undefined = undefined;
        try {
            const isStorageAvailable = await ExternalStorage.isStorageAvailable();
            const isStorageWritable = await ExternalStorage.isStorageWritable();

            if (isStorageAvailable && !isStorageWritable) {
                userDataPath = await ExternalStorage.getPath();
            }
        } catch (err) {
            console.warn(err);
            return;
        }

        const storePath = `${userDataPath}/assets`;

        try {
            if (!await assetsService.exists(storePath)) {
                await assetsService.mkdir(storePath);
            }
        } catch (err) {
            console.warn(err, storePath);
        }

        let savedThemes: IEQueueTheme | undefined;
        try {
            savedThemes = await assetsService.readFile(`${storePath}/${THEMES_FILE_NAME}`);
        } catch (err) {
            console.warn("Saved data not found.");
        }

        if (!!savedThemes) {
            // Saved
            this.props._onChangeThemes(savedThemes);
        } else {
            // Embeded
            this.props._onChangeThemes(embededTheme);
        }

        this._orderDataCombiner = new OrderDataCombiner({
            getRefs: () => ({
                products: this._menuRefs?.refs.products as Array<ICompiledProduct>,
                orderTypes: this._menuRefs?.refs.orderTypes as Array<ICompiledOrderType>,
                currencies: this._menuRefs?.refs.__raw.currencies as Array<ICurrency>,
            }),
            dataService: orderApiService,
            updateTimeout: config.refServer.updateTimeout,
        });

        this._orderDataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
            filter(data => !!data),
        ).subscribe(
            data => {
                this.props._onChangeOrders(data, this._orderDataCombiner?.getRefVersion(RefTypes.ORDERS) as number);
            }
        );

        this._orderDataCombiner.onProgress.pipe(
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(
            progress => {
                this.props._onProgress(progress);
            },
        );

        this._menuDataCombiner = new MenuDataCombiner({
            assetsTransformer: (assets: Array<IAsset>) => {
                return {
                    onComplete: of(assets),
                    onProgress: of({ total: 0, current: 0 }),
                } as IAssetsStoreResult;
            },
            dataService: refApiService,
            updateTimeout: config.refServer.updateTimeout,
        });

        this._menuDataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
            filter(data => !!data),
        ).subscribe(
            data => {
                let isNeedLoadOrderRefs = false;
                if (!this._menuRefs) {
                    isNeedLoadOrderRefs = true;
                }

                this._menuRefs = data;

                if (!!this._orderDataCombiner) {
                    if (isNeedLoadOrderRefs) {
                        this._orderDataCombiner.init();
                    } else {
                        this._orderDataCombiner.dependenciesRefs = {
                            products: data.refs?.products,
                            orderTypes: data.refs?.orderTypes,
                            currencies: data.refs?.__raw?.currencies,
                        };
                    }
                }

                this.props._onChangeMenu(data);

                const terminal = data.refs.__raw.terminals.find(t => t.id === this.props._terminalId);
                if (!!terminal) {
                    const themes: IEQueueTheme | undefined = data.refs.themes?.length > 0 ? compileThemes(data.refs.themes, terminal.config.theme) : undefined;
                    // Override embeded themes
                    if (!!themes) {
                        const theme = {
                            name: terminal.config.theme,
                            themes: themes.themes,
                        }
                        this.props._onChangeThemes(theme);
                        assetsService.writeFile(`${storePath}/${THEMES_FILE_NAME}`, theme);
                    }

                    this.props._onChangeTerminal(terminal);
                }
            },
        );

        this._menuDataCombiner.onProgress.pipe(
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(
            progress => {
                this.props._onProgress(progress);
            },
        );

        this._version$.pipe(
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(
            version => {
                // чтобы не обновлять весь список, когда конкретный заказ был обновлен
                if (!!this._orderDataCombiner) {
                    this._orderDataCombiner.setRefVersion(RefTypes.ORDERS, version as number);
                    this._orderDataCombiner.setOrders(this.props._orders as Array<ICompiledOrder>);
                }
            }
        )
    }

    load(): void {
        if (this._isLoadingStarted) {
            return;
        }

        this._isLoadingStarted = true;

        forkJoin([
            this._serialNumber$.pipe(
                // filter(s => s !== undefined),
                take(1), // Если серийник поменяется, нужно чистить базу
            ),
        ]).pipe(
            take(1),
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(() => {
            this._menuDataCombiner?.init(this.props._storeId as string, {
                refList: [
                    RefTypes.LANGUAGES,
                    RefTypes.TRANSLATIONS,
                    RefTypes.TERMINALS,
                    RefTypes.THEMES,
                ],
            });
        });
    }

    shouldComponentUpdate(nextProps: Readonly<IDataCollectorServiceProps>, nextState: Readonly<IDataCollectorServiceState>, nextContext: any) {
        if (this.props._serialNumber !== nextProps._serialNumber) {
            this._serialNumber$.next(this.props._serialNumber);
        }

        if (nextProps._currentScreen === MainNavigationScreenTypes.LOADING && !!nextProps._storeId) {
            this.load();
        }

        if (super.shouldComponentUpdate) return super.shouldComponentUpdate(nextProps, nextState, nextContext);
        return true;
    }

    componentWillUnmount() {
        if (!!this._menuDataCombiner) {
            this._menuDataCombiner.dispose();
            this._menuDataCombiner = null;
        }

        if (!!this._unsubscribe$) {
            this._unsubscribe$.next();
            this._unsubscribe$.complete();
            this._unsubscribe$ = null;
        }
    }

    render() {
        return <></>;
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _serialNumber: SystemSelectors.selectSerialNumber(state),
        _storeId: SystemSelectors.selectStoreId(state),
        _terminalId: SystemSelectors.selectTerminalId(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
        _version: OrdersSelectors.selectVersion(state),
        _orders: OrdersSelectors.selectCollection(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onChangeMenu: (data: ICompiledData) => {
            dispatch(CombinedDataActions.setData(data));
            dispatch(CapabilitiesActions.setLanguage(data.refs.defaultLanguage));
            dispatch(CapabilitiesActions.setOrderType(data.refs.defaultOrderType));
        },
        _onChangeThemes: (themes: IEQueueTheme) => {
            dispatch(CapabilitiesActions.setThemes(themes));
        },
        _onChangeTerminal: (terminal: ITerminal) => {
            dispatch(CombinedDataActions.setTerminal(terminal));
        },
        _onChangeOrders: (data: ICompiledOrderData, version: number) => {
            dispatch(CombinedDataActions.setOrdersData(data));
            dispatch(OrdersActions.setCollection(data.refs?.orders));
            dispatch(OrdersActions.setVersion(version));
        },
        _onProgress: (progress: IProgress) => {
            dispatch(CombinedDataActions.setProgress(progress));
        },
    };
};

export const DataCollectorService = connect(mapStateToProps, mapDispatchToProps)(DataCollectorServiceContainer);