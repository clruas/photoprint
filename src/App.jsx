import { useState } from 'react'
import QRCode from 'react-qr-code'
import './app.sass'

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
			/>
		</div>
		<input type="file" multiple accept='image/*' onChange={getFiles} />
		<div>
			<div>Meus arquivos</div>
			{files.map(file =><div>
				<div>{file.name}</div>
				<img src={file.source} width="120" height="100"/>
			</div>)}
		</div>
		<button onClick={viewPhotos}>Imprimir</button>
		<div className='pix'>
			<div>{ID_COUNTRY_CODE}</div>
			<button>Copiar cóodigo</button>
		</div>
	</div>
}

export default App
