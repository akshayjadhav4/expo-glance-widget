export interface WidgetProviderInfoParams {
    widgetName: string;
    updatePeriodMillis: number;
    description?: string;
    minWidth?: string;
    minHeight?: string;
    targetCellWidth?: string;
    targetCellHeight?: string;
    maxResizeWidth?: string;
    maxResizeHeight?: string;
    previewLayout?: string;
    configure?: string;
    resizeMode?: string;
    widgetCategory?: string;
    widgetFeatures?: string;
}
