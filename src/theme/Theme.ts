import { IEQueueTheme } from "@djonnyx/tornado-types";

export const theme: IEQueueTheme = {
    name: "light",
    themes: {
        ["light"]: {
            common: {
                modal: {
                    background: "#e3e3e3",
                    window: {
                        background: "transparent",
                    }
                },
                modalTransparent: {
                    background: "rgba(0,0,0,0.5)",
                    window: {
                        background: "rgba(0,0,0,0.83)",
                        borderColor: "rgba(0,0,0,0.1)"
                    }
                },
                modalNotification: {
                    background: "none",
                    window: {
                        background: "rgba(0,0,0,0.75)",
                        borderColor: "rgba(0,0,0,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(255,255,255,0.75)",
                },
                alert: {
                    titleColor: "rgba(0,0,0,0.75)",
                    messageColor: "rgba(0,0,0,0.75)",
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                }
            },
            service: {
                errorLabel: {
                    textColor: "red",
                },
                textInput: {
                    placeholderColor: "rgba(0,0,0,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(0,0,0,1)",
                },
                picker: {
                    textColor: "rgba(0,0,0,1)",
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                }
            },
            loading: {
                background: "#fff",
                progressBar: {
                    thumbColor: "rgba(0,0,0,0.85)",
                    trackColor: "rgba(0,0,0,0.75)",
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            orders: {
                new: {
                    background: "#fff",
                    header: {
                        background: "#000",
                        textColor: "#fff",
                    },
                    item: {
                        background: "#ededed",
                        textColor: "rgba(0,0,0,0.75)",
                    }
                },
                complete: {
                    background: "#fff",
                    header: {
                        background: "#000",
                        textColor: "#fff",
                    },
                    item: {
                        background: "#4a9500",
                        textColor: "#fff",
                    }
                },
            },
        },
        ["dark"]: {
            common: {
                modal: {
                    background: "#000",
                    window: {
                        background: "#000",
                    }
                },
                modalTransparent: {
                    background: "rgba(255,255,255,0.25)",
                    window: {
                        background: "rgba(0,0,0,0.83)",
                        borderColor: "rgba(255,255,255,0.1)"
                    }
                },
                modalNotification: {
                    background: "none",
                    window: {
                        background: "rgba(255,255,255,0.75)",
                        borderColor: "rgba(255,255,255,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(0,0,0,0.75)",
                },
                alert: {
                    titleColor: "rgba(255,255,255,0.75)",
                    messageColor: "rgba(255,255,255,0.75)",
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                }
            },
            service: {
                errorLabel: {
                    textColor: "red",
                },
                textInput: {
                    placeholderColor: "rgba(255,255,255,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(255,255,255,1)",
                },
                picker: {
                    textColor: "rgba(255,255,255,1)",
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                }
            },
            loading: {
                background: "#000",
                progressBar: {
                    thumbColor: "rgba(255,255,255,0.85)",
                    trackColor: "rgba(255,255,255,0.75)",
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            orders: {
                new: {
                    background: "#000",
                    header: {
                        background: "#282828",
                        textColor: "rgba(255,255,255,0.75)",
                    },
                    item: {
                        background: "#282828",
                        textColor: "rgba(255,255,255,0.75)",
                    }
                },
                complete: {
                    background: "#000",
                    header: {
                        background: "#2a5500",
                        textColor: "rgba(255,255,255,0.75)",
                    },
                    item: {
                        background: "#2a5500",
                        textColor: "rgba(255,255,255,0.75)",
                    }
                },
            },
        }
    }
};
