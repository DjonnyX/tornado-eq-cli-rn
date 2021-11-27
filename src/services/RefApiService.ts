import { Observable, from, throwError, of } from "rxjs";
import { catchError, map, retry, retryWhen, switchMap } from "rxjs/operators";
import { config } from "../Config";
import {
    IRef, INode, ISelector, IProduct, ITag, IAsset, ILanguage, ITranslation, IBusinessPeriod, IOrderType,
    ICurrency, IAd, IStore, ITerminal, TerminalTypes, ILicense, IEQueueTheme, IAppTheme, ISystemTag, IWeightUnit
} from "@djonnyx/tornado-types";
import { genericRetryStrategy } from "../utils/request";
import { Log } from "./Log";
import { AuthStore } from "../native";
import { extractError } from "../utils/error";
import { ApiErrorCodes } from "./ApiErrorCodes";
import { IDataService } from "@djonnyx/tornado-refs-processor";

interface IRequestOptions {
    useAttempts?: boolean;
    breakAfter?: number;
}

interface IApiRequestOptions {
    serial?: string;
}

const request = (observable: Observable<Response>, options?: IRequestOptions): Observable<Response> => {
    if (options?.useAttempts) {
        return observable.pipe(
            retryWhen(
                genericRetryStrategy({
                    rejectShortAttempts: 5, // 5 последовательных попыток
                    rejectShortTimeout: 5000, // Раз в 5 сек
                    rejectLongTimeout: 60000, // Раз в минуту переобновление
                    excludedStatusCodes: [],
                }),
            ),
        );
    }

    return observable;
}

const parseResponse = (res: Response) => {
    return from(res.json()).pipe(
        catchError(err => {
            switch (res.status) {
                case 401:
                    return throwError("Некорректная лицензия.");
                case 504:
                    return throwError("Ошибка в соединении.");
                default:
                    return throwError("Неизвестная ошибка.");
            }
        }),
        switchMap(data => {
            if (!!data.error && data.error.length > 0) {
                let errText = "";
                switch (data.error[0].code) {
                    case ApiErrorCodes.REF_TERMINAL_TOKEN_CHECK_LICENSE_ERROR:
                        errText = "Ошибка при проверке лицензии";
                        break;
                    case ApiErrorCodes.LIC_ACCOUNT_METHOD_NOT_ALLOWED:
                        errText = "Метод не доступен";
                        break;
                    case ApiErrorCodes.REF_CLIENT_TOKEN_EMPTY_TOKEN:
                    case ApiErrorCodes.LIC_ACCOUNT_TOKEN_EMPTY_TOKEN:
                        errText = "Токен не задан";
                        break;
                    case ApiErrorCodes.LIC_ACCOUNT_TOKEN_VERIFICATION:
                        errText = "Ошибка подлинности токена";
                        break;
                    case ApiErrorCodes.LIC_INTERNAL_TOKEN_EMPTY_TOKEN:
                    case ApiErrorCodes.LIC_INTERNAL_TOKEN_VERIFICATION:
                        errText = "Внутренняя ошибка сервера";
                        break;
                    case ApiErrorCodes.LIC_LICENSE_FINISHED:
                        errText = "Срок действия лицензии прошел";
                        break;
                    case ApiErrorCodes.LIC_LICENSE_NOT_FOUND:
                        errText = "Лицензия не найдена";
                        break;
                    case ApiErrorCodes.REF_TERMINAL_TOKEN_BAD_FORMAT:
                    case ApiErrorCodes.LIC_TERMINAL_TOKEN_BAD_FORMAT:
                    case ApiErrorCodes.LIC_TERMINAL_TOKEN_VERIFICATION:
                        errText = "Ошибка подлинности токена";
                        break;
                    default: {
                        return throwError(extractError(data.error) || `Неизвестная ошибка (${data.error[0].code})`);
                    }
                }
                return throwError(`${errText} (${data.error[0].code})`);
            }

            return of(data);
        }),
    );
}

class RefApiService implements IDataService<IEQueueTheme> {
    getNodes(): Observable<INode[]> {
        throw new Error("Method not implemented.");
    }
    
    getSelectors(): Observable<ISelector[]> {
        throw new Error("Method not implemented.");
    }
    
    getProducts(): Observable<IProduct[]> {
        throw new Error("Method not implemented.");
    }
    
    getTags(): Observable<ITag[]> {
        throw new Error("Method not implemented.");
    }
    
    getAssets(): Observable<IAsset[]> {
        throw new Error("Method not implemented.");
    }
    
    getBusinessPeriods(): Observable<IBusinessPeriod[]> {
        throw new Error("Method not implemented.");
    }
    
    getOrderTypes(): Observable<IOrderType[]> {
        throw new Error("Method not implemented.");
    }
    
    getCurrencies(): Observable<ICurrency[]> {
        throw new Error("Method not implemented.");
    }
    
    getAds(): Observable<IAd[]> {
        throw new Error("Method not implemented.");
    }

    getSystemTags(): Observable<ISystemTag[]> {
        throw new Error("Method not implemented.");
    }

    getWeightUnits(): Observable<IWeightUnit[]> {
        throw new Error("Method not implemented.");
    }

    private _serial: string | undefined;

    public set serial(v: string) {
        if (this._serial === v) {
            return;
        }

        this._serial = v;
    }

    async getAccessToken(options?: IApiRequestOptions): Promise<string> {
        return AuthStore.getToken(options?.serial || this._serial || "", config.refServer.apiKeyTokenSalt);
    }

    terminalLicenseVerify(serial: string): Observable<ILicense> {
        Log.i("RefApiService", "terminalLicenseVerify");
        return request(
            from(AuthStore.getToken(serial, config.refServer.apiKeyTokenSalt)).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/device/license-verify`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                },
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> terminalLicenseVerify: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }

    terminalRegistration(serial: string): Observable<ITerminal> {
        Log.i("RefApiService", "terminalRegistry");
        return request(
            from(AuthStore.getToken(serial, config.refServer.apiKeyTokenSalt)).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/device/registration`,
                            {
                                method: "POST",
                                headers: {
                                    "x-access-token": token,
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    type: TerminalTypes.ORDER_PICKER,
                                }),
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> terminalRegistry: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }

    terminalSetParams(id: string, params: { name: string, storeId: string }): Observable<ITerminal> {
        Log.i("RefApiService", "terminalSetParams");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/terminal/${id}`,
                            {
                                method: "PUT",
                                headers: {
                                    "x-access-token": token,
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(params),
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> terminalSetParams: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }

    getRefs(): Observable<Array<IRef>> {
        Log.i("RefApiService", "getRefs");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/refs?theme=${TerminalTypes.EQUEUE}`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> getRefs: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }

    getLanguages(): Observable<Array<ILanguage>> {
        Log.i("RefApiService", "getLanguages");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/languages`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getTranslations(): Observable<Array<ITranslation>> {
        Log.i("RefApiService", "getTranslations");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/translations`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getStores(options?: IApiRequestOptions): Observable<Array<IStore>> {
        Log.i("RefApiService", "getStores");
        return request(
            from(this.getAccessToken(options)).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/stores`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            catchError(err => {
                return throwError(err);
            }),
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getTerminals(): Observable<Array<ITerminal>> {
        Log.i("RefApiService", "getTerminals");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/terminals?type.equals=${TerminalTypes.EQUEUE}`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getThemes(): Observable<Array<IAppTheme<IEQueueTheme>>> {
        Log.i("RefApiService", "getThemes");
        let response: Observable<Array<IAppTheme<IEQueueTheme>>>;
        try {
            response = request(
                from(this.getAccessToken()).pipe(
                    switchMap(token => {
                        return from(
                            fetch(`${config.refServer.address}/api/v1/app-themes?type.equals=${TerminalTypes.EQUEUE}`,
                                {
                                    method: "GET",
                                    headers: {
                                        "x-access-token": token,
                                    },
                                }
                            )
                        );
                    })
                ),
            ).pipe(
                switchMap(res => parseResponse(res)),
                map(resData => {
                    return resData.data;
                }),
            );
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }
}

export const refApiService = new RefApiService();