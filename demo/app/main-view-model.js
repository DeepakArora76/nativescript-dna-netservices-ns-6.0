"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var nativescript_dna_netservices_1 = require("nativescript-dna-netservices");
var operators_1 = require("rxjs/operators");
var DnaNetServiceDemoModel = (function (_super) {
    __extends(DnaNetServiceDemoModel, _super);
    function DnaNetServiceDemoModel() {
        var _this = _super.call(this) || this;
        _this.subscription = null;
        _this.networkStatusSubscription = null;
        _this.resolveSubscription = null;
        _this.registrationSubscription = null;
        _this.dnaZeroConfServiceBrowser = new nativescript_dna_netservices_1.ZeroConfServiceBrowser();
        _this.dnaZeroConfService = new nativescript_dna_netservices_1.ZeroConfService();
        return _this;
    }
    DnaNetServiceDemoModel.prototype.onBrowseServiceTap = function (args) {
        if (this.subscription)
            this.subscription.unsubscribe();
        this.subscription = this.dnaZeroConfServiceBrowser
            .searchForServicesOfTypeInDomain("_transably._tcp", "local.")
            .subscribe(function (data) {
            console.log(data);
        });
    };
    DnaNetServiceDemoModel.prototype.onWifiIpAddressTap = function (args) {
        var _this = this;
        nativescript_dna_netservices_1.NetworkMonitorService.getWiFiIpAddress()
            .pipe(operators_1.tap(function (ip) { return console.info(ip); }))
            .subscribe(function (ipAddr) {
            _this.set("message", ipAddr);
        });
    };
    DnaNetServiceDemoModel.prototype.onResolveServiceTap = function (args) {
        if (this.resolveSubscription)
            this.resolveSubscription.unsubscribe();
        this.resolveSubscription = this.dnaZeroConfService
            .resolve({ domain: "local.", type: "_airplay._tcp.", name: "Apple TV" })
            .pipe(operators_1.tap(function (data) { return console.info(data); }))
            .subscribe(function (data) { return console.info(data); }, function (error) { return console.error(error); });
    };
    DnaNetServiceDemoModel.prototype.onRegisterServiceTap = function (args) {
        if (this.registrationSubscription)
            this.registrationSubscription.unsubscribe();
        this.registrationSubscription = this.dnaZeroConfService
            .publish({
            domain: "local.",
            type: "_bridge-the-world._tcp.",
            name: "Bridge The World",
            port: 61234
        })
            .pipe(operators_1.tap(function (data) { return console.error(data); }))
            .subscribe(function (data) { return console.info(data); }, function (error) { return console.error(error); });
    };
    DnaNetServiceDemoModel.prototype.onSubscribeToNetworkStatusTap = function (args) {
        var _this = this;
        if (this.networkStatusSubscription)
            return;
        this.networkStatusSubscription = nativescript_dna_netservices_1.NetworkMonitorService.monitorNetwork()
            .pipe(operators_1.tap(function (networkStatus) { return console.info(networkStatus); }))
            .subscribe(function (ns) {
            var connType = "";
            switch (ns.connType) {
                case nativescript_dna_netservices_1.networkType.wifi:
                    connType = "WiFi";
                    break;
                case nativescript_dna_netservices_1.networkType.cellular:
                    connType = "Cellular";
                    break;
                default:
                    connType = "Unavailable";
            }
            _this.set("networkStatus", connType + ": " + ns.ipAddress);
        });
    };
    return DnaNetServiceDemoModel;
}(observable_1.Observable));
exports.DnaNetServiceDemoModel = DnaNetServiceDemoModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi12aWV3LW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi12aWV3LW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBQThEO0FBQzlELDZFQU1zQztBQUl0Qyw0Q0FBcUM7QUFFckM7SUFBNEMsMENBQVU7SUFTcEQ7UUFBQSxZQUNFLGlCQUFPLFNBR1I7UUFUTyxrQkFBWSxHQUFpQixJQUFJLENBQUM7UUFDbEMsK0JBQXlCLEdBQWlCLElBQUksQ0FBQztRQUMvQyx5QkFBbUIsR0FBaUIsSUFBSSxDQUFDO1FBQ3pDLDhCQUF3QixHQUFpQixJQUFJLENBQUM7UUFJcEQsS0FBSSxDQUFDLHlCQUF5QixHQUFHLElBQUkscURBQXNCLEVBQUUsQ0FBQztRQUM5RCxLQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSw4Q0FBZSxFQUFFLENBQUM7O0lBQ2xELENBQUM7SUFFTSxtREFBa0IsR0FBekIsVUFBMEIsSUFBZTtRQUN2QyxJQUFJLElBQUksQ0FBQyxZQUFZO1lBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx5QkFBeUI7YUFDL0MsK0JBQStCLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDO2FBQzVELFNBQVMsQ0FBQyxVQUFBLElBQUk7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLG1EQUFrQixHQUF6QixVQUEwQixJQUFlO1FBQXpDLGlCQU1DO1FBTEMsb0RBQXFCLENBQUMsZ0JBQWdCLEVBQUU7YUFDckMsSUFBSSxDQUFDLGVBQUcsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQzthQUNqQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ2YsS0FB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b3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlXCI7XG5pbXBvcnQge1xuICBaZXJvQ29uZlNlcnZpY2VCcm93c2VyLFxuICBaZXJvQ29uZlNlcnZpY2UsXG4gIE5ldHdvcmtNb25pdG9yU2VydmljZSxcbiAgbmV0d29ya1R5cGUsXG4gIHplcm9Db25mRXJyb3Jcbn0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kbmEtbmV0c2VydmljZXNcIjtcblxuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XG5cbmV4cG9ydCBjbGFzcyBEbmFOZXRTZXJ2aWNlRGVtb01vZGVsIGV4dGVuZHMgT2JzZXJ2YWJsZSB7XG4gIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmc7XG4gIHByaXZhdGUgZG5hWmVyb0NvbmZTZXJ2aWNlQnJvd3NlcjogWmVyb0NvbmZTZXJ2aWNlQnJvd3NlcjtcbiAgcHJpdmF0ZSBkbmFaZXJvQ29uZlNlcnZpY2U6IFplcm9Db25mU2VydmljZTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gIHByaXZhdGUgbmV0d29ya1N0YXR1c1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgcHJpdmF0ZSByZXNvbHZlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBudWxsO1xuICBwcml2YXRlIHJlZ2lzdHJhdGlvblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZG5hWmVyb0NvbmZTZXJ2aWNlQnJvd3NlciA9IG5ldyBaZXJvQ29uZlNlcnZpY2VCcm93c2VyKCk7XG4gICAgdGhpcy5kbmFaZXJvQ29uZlNlcnZpY2UgPSBuZXcgWmVyb0NvbmZTZXJ2aWNlKCk7XG4gIH1cblxuICBwdWJsaWMgb25Ccm93c2VTZXJ2aWNlVGFwKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZG5hWmVyb0NvbmZTZXJ2aWNlQnJvd3NlclxuICAgICAgLnNlYXJjaEZvclNlcnZpY2VzT2ZUeXBlSW5Eb21haW4oXCJfdHJhbnNhYmx5Ll90Y3BcIiwgXCJsb2NhbC5cIilcbiAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25XaWZpSXBBZGRyZXNzVGFwKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIE5ldHdvcmtNb25pdG9yU2VydmljZS5nZXRXaUZpSXBBZGRyZXNzKClcbiAgICAgIC5waXBlKHRhcChpcCA9PiBjb25zb2xlLmluZm8oaXApKSlcbiAgICAgIC5zdWJzY3JpYmUoaXBBZGRyID0+IHtcbiAgICAgICAgdGhpcy5zZXQoXCJtZXNzYWdlXCIsIGlwQWRkcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvblJlc29sdmVTZXJ2aWNlVGFwKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIGlmICh0aGlzLnJlc29sdmVTdWJzY3JpcHRpb24pIHRoaXMucmVzb2x2ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMucmVzb2x2ZVN1YnNjcmlwdGlvbiA9IHRoaXMuZG5hWmVyb0NvbmZTZXJ2aWNlXG4gICAgICAucmVzb2x2ZSh7IGRvbWFpbjogXCJsb2NhbC5cIiwgdHlwZTogXCJfYWlycGxheS5fdGNwLlwiLCBuYW1lOiBcIkFwcGxlIFRWXCIgfSlcbiAgICAgIC5waXBlKHRhcChkYXRhID0+IGNvbnNvbGUuaW5mbyhkYXRhKSkpXG4gICAgICAuc3Vic2NyaWJlKGRhdGEgPT4gY29uc29sZS5pbmZvKGRhdGEpLCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XG4gIH1cblxuICBwdWJsaWMgb25SZWdpc3RlclNlcnZpY2VUYXAoYXJnczogRXZlbnREYXRhKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cmF0aW9uU3Vic2NyaXB0aW9uKVxuICAgICAgdGhpcy5yZWdpc3RyYXRpb25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblxuICAgIHRoaXMucmVnaXN0cmF0aW9uU3Vic2NyaXB0aW9uID0gdGhpcy5kbmFaZXJvQ29uZlNlcnZpY2VcbiAgICAgIC5wdWJsaXNoKHtcbiAgICAgICAgZG9tYWluOiBcImxvY2FsLlwiLFxuICAgICAgICB0eXBlOiBcIl9icmlkZ2UtdGhlLXdvcmxkLl90Y3AuXCIsXG4gICAgICAgIG5hbWU6IFwiQnJpZGdlIFRoZSBXb3JsZFwiLFxuICAgICAgICBwb3J0OiA2MTIzNFxuICAgICAgfSlcbiAgICAgIC5waXBlKHRhcChkYXRhID0+IGNvbnNvbGUuZXJyb3IoZGF0YSkpKVxuICAgICAgLnN1YnNjcmliZShkYXRhID0+IGNvbnNvbGUuaW5mbyhkYXRhKSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xuICB9XG5cbiAgcHVibGljIG9uU3Vic2NyaWJlVG9OZXR3b3JrU3RhdHVzVGFwKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIGlmICh0aGlzLm5ldHdvcmtTdGF0dXNTdWJzY3JpcHRpb24pIHJldHVybjtcbiAgICB0aGlzLm5ldHdvcmtTdGF0dXNTdWJzY3JpcHRpb24gPSBOZXR3b3JrTW9uaXRvclNlcnZpY2UubW9uaXRvck5ldHdvcmsoKVxuICAgICAgLnBpcGUodGFwKG5ldHdvcmtTdGF0dXMgPT4gY29uc29sZS5pbmZvKG5ldHdvcmtTdGF0dXMpKSlcbiAgICAgIC5zdWJzY3JpYmUobnMgPT4ge1xuICAgICAgICBsZXQgY29ublR5cGUgPSBcIlwiO1xuICAgICAgICBzd2l0Y2ggKG5zLmNvbm5UeXBlKSB7XG4gICAgICAgICAgY2FzZSBuZXR3b3JrVHlwZS53aWZpOlxuICAgICAgICAgICAgY29ublR5cGUgPSBcIldpRmlcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgbmV0d29ya1R5cGUuY2VsbHVsYXI6XG4gICAgICAgICAgICBjb25uVHlwZSA9IFwiQ2VsbHVsYXJcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25uVHlwZSA9IFwiVW5hdmFpbGFibGVcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldChcIm5ldHdvcmtTdGF0dXNcIiwgY29ublR5cGUgKyBcIjogXCIgKyBucy5pcEFkZHJlc3MpO1xuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==