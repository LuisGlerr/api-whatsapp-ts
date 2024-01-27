"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsTransporter extends whatsapp_web_js_1.Client {
    constructor() {
        super({
            authStrategy: new whatsapp_web_js_1.LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox'],
            },
        });
        this.status = false;
        console.log("Iniciando....");
        try {
            this.initialize();
            this.on("ready", () => {
                this.status = true;
                console.log("LOGIN_SUCCESS");
            });
            this.on("auth_failure", () => {
                this.status = false;
                console.log("LOGIN_FAIL");
            });
            this.on("qr", (qr) => {
                console.log("Escanea el codigo QR que esta en la carepta tmp");
                qrcode_terminal_1.default.generate(qr, { small: true });
            });
            this.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
                console.log('from: ', message.from, ' ', 'message: ', message.body);
                if (message.from == `521${process.env.PHONE}@c.us` || message.from == `521${process.env.PHONE2}@c.us`) {
                    // let contacts = await client.getBlockedContacts()
                    // console.log('contacts length ', contacts.length)
                    // console.log('contacts ', contacts)
                    //await client.muteChat(message.from, null)
                    //await client.archiveChat(message.from)
                    yield message.delete(true);
                    //await client.sendMessage(message.from, 'pong');
                }
            }));
        }
        catch (error) {
            console.log('Error ', error);
        }
    }
    /**
     * Enviar mensaje de WS
     * @param lead
     * @returns
     */
    sendMsg(lead) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.status)
                    return Promise.resolve({ error: "WAIT_LOGIN" });
                const { message, phone } = lead;
                const response = yield this.sendMessage(`${phone}@c.us`, message);
                return { id: response.id.id };
            }
            catch (e) {
                return Promise.resolve({ error: e.message });
            }
        });
    }
    getStatus() {
        return this.status;
    }
}
exports.default = WsTransporter;
