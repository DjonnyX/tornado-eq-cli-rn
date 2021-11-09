import { IAppTheme, IEQueueTheme, IEQueueThemeColors } from "@djonnyx/tornado-types";

export const THEMES_FILE_NAME = "themes.json";

export const compileThemes = (themes: Array<IAppTheme<IEQueueThemeColors>>, name: string): IEQueueTheme => {
    const result: IEQueueTheme = {
        name,
        themes: {},
    };

    themes.forEach(t => {
        result.themes[t.id!] = t.data;
    });

    return result;
}

/**
 * Embeded theme
 */
export const embededTheme: IEQueueTheme = {
    name: "light",
    themes: {
        ["light"]: {
            common: {
                modal: {
                    backgroundColor: "#e3e3e3",
                    window: {
                        backgroundColor: "transparent",
                    }
                },
                modalTransparent: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    window: {
                        backgroundColor: "#fff",
                        borderColor: "rgba(0,0,0,0.1)"
                    }
                },
                modalNotification: {
                    backgroundColor: "none",
                    window: {
                        backgroundColor: "rgba(0,0,0,0.75)",
                        borderColor: "rgba(0,0,0,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(255,255,255,0.75)",
                    textFontSize: 20,
                },
                alert: {
                    titleColor: "rgba(0,0,0,0.75)",
                    titleFontSize: 20,
                    messageColor: "rgba(0,0,0,0.75)",
                    messageFontSize: 18,
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                    buttonTextFontSize: 14,
                }
            },
            service: {
                errorLabel: {
                    textColor: "red",
                    textFontSize: 12,
                },
                textInput: {
                    placeholderColor: "rgba(0,0,0,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(0,0,0,1)",
                    textFontSize: 16,
                },
                picker: {
                    textColor: "rgba(0,0,0,1)",
                    textFontSize: 16,
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                }
            },
            loading: {
                backgroundColor: "#fff",
                progressBar: {
                    thumbColor: "rgba(0,0,0,0.85)",
                    trackColor: "rgba(0,0,0,0.75)",
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 13,
                }
            },
            orders: {
                backgroundColor: "transparent",
                new: {
                    backgroundColor: "#fff",
                    header: {
                        backgroundColor: "#000",
                        textColor: "#fff",
                    },
                    item: {
                        backgroundColor: "#ededed",
                        textColor: "rgba(0,0,0,0.75)",
                    }
                },
                complete: {
                    backgroundColor: "#fff",
                    header: {
                        backgroundColor: "#000",
                        textColor: "#fff",
                    },
                    item: {
                        backgroundColor: "#4a9500",
                        textColor: "#fff",
                    }
                },
            },
        },
        ["dark"]: {
            common: {
                modal: {
                    backgroundColor: "#000",
                    window: {
                        backgroundColor: "#000",
                    }
                },
                modalTransparent: {
                    backgroundColor: "rgba(255,255,255,0.075)",
                    window: {
                        backgroundColor: "#000",
                        borderColor: "rgba(255,255,255,0.1)"
                    }
                },
                modalNotification: {
                    backgroundColor: "none",
                    window: {
                        backgroundColor: "rgba(255,255,255,0.75)",
                        borderColor: "rgba(255,255,255,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 20,
                },
                alert: {
                    titleColor: "rgba(255,255,255,0.75)",
                    titleFontSize: 20,
                    messageColor: "rgba(255,255,255,0.75)",
                    messageFontSize: 18,
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                    buttonTextFontSize: 14,
                }
            },
            service: {
                errorLabel: {
                    textColor: "red",
                    textFontSize: 12,
                },
                textInput: {
                    placeholderColor: "rgba(255,255,255,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                },
                picker: {
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                }
            },
            loading: {
                backgroundColor: "#000",
                progressBar: {
                    thumbColor: "rgba(255,255,255,0.85)",
                    trackColor: "rgba(255,255,255,0.75)",
                    textColor: "rgba(255,255,255,0.75)",
                    textFontSize: 13,
                }
            },
            orders: {
                backgroundColor: "transparent",
                new: {
                    backgroundColor: "#000",
                    header: {
                        backgroundColor: "#282828",
                        textColor: "rgba(255,255,255,0.75)",
                    },
                    item: {
                        backgroundColor: "#282828",
                        textColor: "rgba(255,255,255,0.75)",
                    }
                },
                complete: {
                    backgroundColor: "#000",
                    header: {
                        backgroundColor: "#2a5500",
                        textColor: "rgba(255,255,255,0.75)",
                    },
                    item: {
                        backgroundColor: "#2a5500",
                        textColor: "rgba(255,255,255,0.75)",
                    }
                },
            },
        }
    }
};
