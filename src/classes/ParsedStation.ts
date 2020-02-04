export default class ParsedStation {
    public platform = "";
    public station = "";
    protected parseSuccess = false;

    constructor(fullName: string) {
        const pattern = /(?:.*,\s*)?(.+) Station,\s*Platform (\d+)/;
        const results = pattern.exec(fullName);
        if (results) {
            if (results.length >= 1) {
                this.station = results[1];
            }
            if (results.length >= 2) {
                this.platform = results[2];
                this.parseSuccess = true;
            }
        }
    }

    isParseSuccess() {
        return this.parseSuccess;
    }
}