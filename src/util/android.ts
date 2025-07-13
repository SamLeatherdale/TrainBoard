type WindowWithAndroid = Window & {
    android?: AndroidModule;
};
type AndroidModule = {
    ready: () => void;
    reload: () => void;
};

export function getAndroid(): AndroidModule | undefined {
    return (window as WindowWithAndroid).android;
}
