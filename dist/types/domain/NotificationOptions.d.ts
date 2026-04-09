type NotificationOptionResponse = {
    sound: boolean;
    vibration: boolean;
};
type NotificationOptionsArguments = {
    sound: boolean;
    vibration: boolean;
};
export default class NotificationOptions {
    sound: boolean;
    vibration: boolean;
    static parse(plain: NotificationOptionResponse): NotificationOptions;
    static newFrom(profile: NotificationOptions): any;
    constructor({ sound, vibration, }?: NotificationOptionsArguments);
    setSound(sound: boolean): NotificationOptions;
    setVibration(vibration: boolean): NotificationOptions;
    enable(): this;
    disable(): this;
    isEnabled(): boolean;
}
export {};
//# sourceMappingURL=NotificationOptions.d.ts.map