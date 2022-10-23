import { useState } from 'react'
import QRCode from 'react-qr-code'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './app.sass'

/*
const ID_PAYLOAD_FORMAT_INDICATOR = '00';
const ID_MERCHANT_ACCOUNT_INFORMATION = '26';
const ID_MERCHANT_ACCOUNT_INFORMATION_GUI = '00';
const ID_MERCHANT_ACCOUNT_INFORMATION_KEY = '01';
const ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = '02';
const ID_MERCHANT_CATEGORY_CODE = '52';
const ID_TRANSACTION_CURRENCY = '53';
const ID_TRANSACTION_AMOUNT = '54';
const ID_COUNTRY_CODE = '58';
const ID_MERCHANT_NAME = '59';
const ID_MERCHANT_CITY = '60';
const ID_ADDITIONAL_DATA_FIELD_TEMPLATE = '62';
const ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = '05';
const ID_CRC16 = '63';

class PayloadData {
	constructor(id, value) {
		this.id = id
		this.value = value.toString()
	}
	getValue() {
		return this.id + ('00' + this.value.length).slice(-2) + this.value
	}
}

const gui = new PayloadData('00', 'br.gov.bcb.pix')
const key = new PayloadData('01', 'clruas@gmail.com')
const desc = new PayloadData('02', 'Pagamento PhotoPrint')
const txID = new PayloadData('05', 'PHPR898')

const payloadData = [
	new PayloadData('00', '01'),
	new PayloadData('26', gui.getValue() + key.getValue() + desc.getValue()),
	new PayloadData('52', '0000'),
	new PayloadData('53', '986'),
	new PayloadData('54', 54.50),
	new PayloadData('58', 'BR'),
	new PayloadData('59', 'Cleverson Ruas'),
	new PayloadData('60', 'MONTES CLAROS'),
	new PayloadData('62', txID.getValue()),
]

payloadData.map(pd => {
	console.log(pd.getValue())
})
*/

function App() {
	const [files, setFiles] = useState([])
	const viewPhotos = e => {
		console.log(files)
	}
	const getFiles = e => {
		const fileList = Array.from(e.target.files)
		setFiles([])
		fileList.forEach(file => {
			const reader = new FileReader()
			reader.onloadend = e => setFiles(state => [...state, { name: file.name, source: e.target.result }])
			reader.readAsDataURL(file)
		})
	}
	const wifi = "WIFI:S:CASANET;T:WPA;P:10302040;;"
	const appURL = "http://192.168.0.10:5173"
	/*
	const payload = {
		pixKey: 'clruas@gmail.com',
		description: 'Pagamento PhotoPrint',
		merchantName: 'PhotoPrint',
		merchantCity: 'MONTES CLAROS',
		amount: 45.50,
		txID: 'PHPR898'
	}
	function getPayload() {
		const getValue = value => ('00' + value.length).slice(-2) + value
		const payloadFormatIndicator = ID_PAYLOAD_FORMAT_INDICATOR + getValue('01')
		const bankDomain = ID_MERCHANT_ACCOUNT_INFORMATION_GUI + getValue('br.gov.bcb.pix')
		return bankDomain//JSON.stringify(payload)
	}
	*/
	const pix = new Pix('clruas@gmail.com', 'Pagamento PhotoPrint', 'Cleverson Ruas', 'MONTES CLAROS', 'PHPR898', 54.50)
	const payload = pix.getPayload()
	function handleCopy(e) {
		//navigator.clipboard.writeText(payload)
		document.execCommand('copy')
	}
	return <div className="app">
		<div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
			<QRCode
				size={256}
				style={{ height: "auto", maxWidth: "100%", width: "100%" }}
				value={wifi}
				viewBox={`0 0 256 256`}
			/>
			<QRCode
				value={appURL}
				size={100}
			/>
		</div>
		<input type="file" multiple accept='image/*' onChange={getFiles} />
		<div>
			<div>Meus arquivos</div>
			{files.map(file => <div>
				<div>{file.name}</div>
				<img src={file.source} width="120" height="100" />
			</div>)}
		</div>
		<button onClick={viewPhotos}>Imprimir</button>
		<div className='pix'>
			<div>{payload}</div>
			<CopyToClipboard text={payload}>
				<button>Copiar cóodigo</button>
			</CopyToClipboard>
		</div>
	</div>
}

class Pix {
	constructor(pixKey, description, merchantName, merchantCity, txid, amount) {
		this.pixKey = pixKey;
		this.description = description;
		this.merchantName = merchantName;
		this.merchantCity = merchantCity;
		this.txid = txid;
		this.amount = amount.toFixed(2);

		this.ID_PAYLOAD_FORMAT_INDICATOR = "00";
		this.ID_MERCHANT_ACCOUNT_INFORMATION = "26";
		this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI = "00";
		this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY = "01";
		this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = "02";
		this.ID_MERCHANT_CATEGORY_CODE = "52";
		this.ID_TRANSACTION_CURRENCY = "53";
		this.ID_TRANSACTION_AMOUNT = "54";
		this.ID_COUNTRY_CODE = "58";
		this.ID_MERCHANT_NAME = "59";
		this.ID_MERCHANT_CITY = "60";
		this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE = "62";
		this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = "05";
		this.ID_CRC16 = "63";
	}

	_getValue(id, value) {
		const size = String(value.length).padStart(2, "0");
		return id + size + value;
	}

	_getMechantAccountInfo() {
		const gui = this._getValue(
			this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI,
			"br.gov.bcb.pix"
		);
		const key = this._getValue(
			this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY,
			this.pixKey
		);
		const description = this._getValue(
			this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION,
			this.description
		);

		return this._getValue(
			this.ID_MERCHANT_ACCOUNT_INFORMATION,
			gui + key + description
		);
	}

	_getAdditionalDataFieldTemplate() {
		const txid = this._getValue(
			this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,
			this.txid
		);
		return this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
	}

	getPayload() {
		const payload =
			this._getValue(this.ID_PAYLOAD_FORMAT_INDICATOR, "01") +
			this._getMechantAccountInfo() +
			this._getValue(this.ID_MERCHANT_CATEGORY_CODE, "0000") +
			this._getValue(this.ID_TRANSACTION_CURRENCY, "986") +
			this._getValue(this.ID_TRANSACTION_AMOUNT, this.amount) +
			this._getValue(this.ID_COUNTRY_CODE, "BR") +
			this._getValue(this.ID_MERCHANT_NAME, this.merchantName) +
			this._getValue(this.ID_MERCHANT_CITY, this.merchantCity) +
			this._getAdditionalDataFieldTemplate();

		return payload + this._getCRC16(payload);
	}

	_getCRC16(payload) {
		function ord(str) {
			return str.charCodeAt(0);
		}
		function dechex(number) {
			if (number < 0) {
				number = 0xffffffff + number + 1;
			}
			return parseInt(number, 10).toString(16);
		}

		//ADICIONA DADOS GERAIS NO PAYLOAD
		payload = payload + this.ID_CRC16 + "04";

		//DADOS DEFINIDOS PELO BACEN
		let polinomio = 0x1021;
		let resultado = 0xffff;
		let length;

		//CHECKSUM
		if ((length = payload.length) > 0) {
			for (let offset = 0; offset < length; offset++) {
				resultado ^= ord(payload[offset]) << 8;
				for (let bitwise = 0; bitwise < 8; bitwise++) {
					if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
					resultado &= 0xffff;
				}
			}
		}

		//RETORNA CÓDIGO CRC16 DE 4 CARACTERES
		return this.ID_CRC16 + "04" + dechex(resultado).toUpperCase();
	}
};

export default App
