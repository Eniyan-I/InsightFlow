import { useState } from 'react';
import './App.css'
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,defaults} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

defaults.maintainAspectRatio=false
defaults.responsive=true

function App(){
  const [SelectedFile,setSelectedFile]=useState('');
  const [Chat,setChat]=useState(false);
  const [Loading,setLoading]=useState(false);

  const [dat,setdat]=useState('');
  const [filestat,setfilestat]=useState('Drop your files here');

  const handleFileChange = (e) => {
    setfilestat(e.target.files[0].name);
    if (e.target.files && e.target.files[0].name) {
      setSelectedFile(e.target.files[0]);
      console.log(SelectedFile);
    }
  };
  const handleclick=async(e)=>{
    if (!SelectedFile){
      alert('please upload a pdf');
      return
    }
    setLoading(true)
    const formData = new FormData();
    formData.append('file',SelectedFile);
    try{
      const response=await fetch('http://127.0.0.1:8000/upload_pdf',{
        method:'POST',
        body:formData
      })
      console.log('waiting for response')
      const res=await response.json();
      setLoading(false)
      setChat(true)
      let msg=res.message.replaceAll('```','')
      msg=msg.replaceAll('json','')
      msg=JSON.parse(msg)
      console.log(msg[0].chart)
      console.log(msg[1].chart)
      console.log(msg[2].chart)
      setdat(msg)
    }catch(error){
      console.error(error)
    }
  }

  return(
    <>
    {!Chat &&
      <div style={{display:'flex',justifyContent:'space-between',padding:'30px',width:'650px',border:'1px solid black',borderRadius:'15px',boxShadow: '0 0 10px rgb(0, 0, 0)',paddingTop:'50px',paddingBottom:'50px'}}>
      <div style={{borderRight:'1px solid black', paddingRight:'15px'}}>
        <h4 style={{color:'black',textAlign:'start',marginTop:'35px',marginBottom:'10px'}}>InsightFlow</h4>
        <p style={{fontWeight:'lighter',fontSize:'small',textAlign:'start',color:'black',width:'300px'}}>An intelligent data analytics workspace where users upload datasets (CSV, JSON, SQL databases) to explore and understand their data. Powered by an AI-driven agent, InsightFlow transforms raw data into meaningful insights through dynamic analysis, interactive visualizations, and automated reporting.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div className="file_input">
          <label htmlFor='for_input' style={{width:'300px',height:'200px',  display: 'flex',alignItems: 'center',justifyContent: 'center',cursor:'pointer'}}>{filestat}</label>
          <input id='for_input' style={{display:'none'}} type="file" accept=".json,.csv" onChange={handleFileChange}></input>
        </div>
        {Loading==false?<button className='submit-btn' onClick={handleclick}>Generate</button>:<p style={{marginTop:'20px',color:'black'}}>Generating...</p>}
      </div>
    </div>}
      {Chat&&
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div>
          <Line style={{height:'300px',width:'80vw'}}
          data={{
            labels: dat[0].chart.xdata,
            datasets: [
              {
                label:dat[0].chart.xlabel,
                data: dat[0].chart.ydata,
                backgroundColor: ['grey'],
              },
            ],
          }}
          options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: dat[0].chart.xlabel,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: dat[0].chart.ylabel,
                  },
                },
              },
            }}
          />
        </div>
        <div style={{display:'flex',marginTop:'40px',width:'70vw',justifyContent:'space-between'}}>
        <div>
          <Bar
            style={{ height: "300px" }}
            data={{
              labels: dat[2].chart.xdata,
              datasets: [
                {
                  label: dat[2].chart.ylabel,
                  data: dat[2].chart.ydata,
                  backgroundColor: "rgba(110, 127, 140, 0.6)",
                  borderColor: "rgb(0, 0, 0)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: dat[2].chart.xlabel,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: dat[2].chart.ylabel,
                  },
                },
              },
            }}
          />
        </div>
        {console.log(dat[1].chart)}
        <div>
          <Doughnut
            data={{
            title:dat[1].chart.title,
            labels: dat[1].chart.label,
            datasets: [
              {
                label:dat[1].chart.label,
                data: dat[1].chart.data,
                backgroundColor:['rgba(149, 96, 96, 0.6)','rgba(140, 145, 98, 0.6)','rgba(112, 150, 90, 0.6)','rgba(86, 143, 129, 0.6)','rgba(100, 85, 154, 0.6)'],
                borderColor:['black']
              },
            ],
          }}
          />
        </div>
        </div>
      </div>}
    </>
  )
}

export default App;