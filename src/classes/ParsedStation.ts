export default class ParsedStation {
    public platform = "";
    public station = "";

    constructor(fullName: string) {
        const pattern = /(?:.*,\s*)?(.+) Station,\s*Platform (\d+)/;
        const results = pattern.exec(fullName);
        if (results) {
            if (results.length >= 1) {
                this.station = results[1];
            }
            if (results.length >= 2) {
                this.platform = results[2];
            }
        }
    }
}