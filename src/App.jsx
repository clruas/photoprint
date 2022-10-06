import { useState } from 'react'
import './app.sass'

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
	return <div className="app">
		<input type="file" multiple accept='image/*' onChange={getFiles} />
		<div>
			<div>Meus arquivos</div>
			{files.map(file =><div>
				<div>{file.name}</div>
				<img src={file.source} width="120" height="100"/>
			</div>)}
		</div>
		<button onClick={viewPhotos}>Imprimir</button>
	</div>
}

export default App
