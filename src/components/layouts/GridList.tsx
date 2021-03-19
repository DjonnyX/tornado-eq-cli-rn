import React, { useState, useCallback, useEffect } from "react";
import { View, LayoutChangeEvent, StyleProp, ViewStyle, Animated, Easing } from "react-native";

interface IBound {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IStatgeCalcParams {
    itemWidth: number;
    itemHeight: number;
    columnsNum: number;
    rowsNum: number;
    gap: number;
}

interface ICollectionItem {
    x: number;
    y: number;
    width: number;
    height: number;
    data: any;
}

interface IGridListProps<T = any> {
    children?: never[];
    style?: StyleProp<ViewStyle>;
    padding?: number;
    data: Array<T>;
    columnsNum: number;
    minItemHeight: number;
    spacing?: number;
    renderItem: (data: { item: T, index: number }) => JSX.Element;
    keyExtractor: (item: T, index: number) => number;
}

export const GridList = React.memo(({ data, renderItem, style, keyExtractor, spacing = 0, padding = 0,
    columnsNum, minItemHeight }: IGridListProps) => {
    const [bound, _setBound] = useState<IBound | undefined>(undefined);
    const [stageCalcParams, _setStageCalcParams] = useState<IStatgeCalcParams | undefined>(undefined);
    const [collection, _setCollection] = useState<Array<ICollectionItem>>([]);

    const changeLayoutHandler = useCallback((event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        _setBound({
            x,
            y,
            width,
            height,
        });
    }, []);

    useEffect(() => {
        if (!!bound && padding !== undefined && spacing !== undefined && columnsNum !== undefined) {
            const gap = spacing * 0.5;
            const rowsNum = Math.floor((bound.height - padding * 2 + gap * 2) / (minItemHeight + gap * 2));
            const itemWidth = Math.floor(bound.width - padding * 2 - columnsNum * gap * 2) / columnsNum;
            const itemHeight = Math.floor(bound.height - padding * 2 + gap * 2 - rowsNum * gap * 2) / rowsNum;

            _setStageCalcParams({
                gap,
                rowsNum,
                columnsNum,
                itemWidth,
                itemHeight,
            });
        }
    }, [bound, padding, spacing, columnsNum]);

    useEffect(() => {
        const newCollection = new Array<ICollectionItem>();
        if (!!data && !!stageCalcParams) {
            const rows = stageCalcParams?.rowsNum as number;
            const columns = stageCalcParams?.columnsNum as number;
            const displayItemsNum = Math.min(data.length, rows * columns);
            const itemWidth = stageCalcParams?.itemWidth as number;
            const itemHeight = stageCalcParams?.itemHeight as number;
            const gap = stageCalcParams?.gap as number;

            let column = 0, row = 0;
            for (let i = 0, l = displayItemsNum; i < l; i++) {
                const itemData = data[i];
                newCollection.push({
                    x: padding + gap + (column * (itemWidth + gap)),
                    y: padding + gap + (row * (itemHeight + gap)),
                    width: itemWidth,
                    height: itemHeight,
                    data: itemData,
                });

                row++;
                if (row >= rows) {
                    row = 0;

                    if (column < columns - 1) {
                        column++;
                    }
                }
            }

            _setCollection(newCollection);
        }
    }, [data, stageCalcParams]);

    return (
        <View
            style={{ width: "100%", height: "100%", ...style as any, padding }}
            onLayout={changeLayoutHandler}
        >
            {
                !!collection && collection.map((item, index) =>
                    <GridListItem key={(keyExtractor(item, index))} data={item}>
                        {
                            renderItem({ item, index })
                        }
                    </GridListItem>
                )
            }
        </View>
    )
});

interface IGridListItemProps {
    data: ICollectionItem;
    children: JSX.Element;
}

const GridListItem = React.memo(({ data, children }: IGridListItemProps) => {
    const [animatedY, setAnimatedY] = useState(new Animated.Value(0));

    useEffect(() => {
        const animationX = Animated.timing(animatedY, {
            useNativeDriver: false,
            toValue: data.y,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        animationX.start();

        const animationY = Animated.timing(animatedY, {
            useNativeDriver: false,
            toValue: data.y,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        animationY.start();

        return () => {
            if (animationX) {
                animationX.stop();
            }
            if (animationY) {
                animationY.stop();
            }
        }
    }, [data]);

    return <Animated.View
        style={{
            position: "absolute", width: data.width, height: data.height, left: data.x, top: animatedY,
            justifyContent: "center", overflow: "hidden"
        }}>
        {
            children
        }
    </Animated.View>
})