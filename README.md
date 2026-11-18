# InsightFlow
<p>InsightFlow is an AI-powered data analysis and visualization platform built using React.js, FastAPI, LangChain, and LangGraph. It enables users to upload and process CSV files, automate data cleaning, and generate interactive visualizations. A LangGraph Supervisor Agent coordinates specialized Data Cleaner and Visualizer agents to streamline data processing and analysis. Gemini API integration enhances AI-powered data processing, while Chart.js provides dynamic and interactive data visualizations.</p>
<h3>Tech Stack</h3>
</t><li>Frontend: React.js
<li>Backend: FastAPI, Python</li>
<li>AI & LLM: LangChain, LangGraph, Gemini API</li>
<li>Visualization: Chart.js</li>
<li>API: REST API</li>

<h3>Architecture</h3>

                         USER
                           |
                           v
                  +-------------------+
                  |     React.js      │
                  |     Frontend      │
                  +-------------------+
                           |
                           | REST API Requests
                           v
                  +-------------------+
                  |     FastAPI       |
                  |     Backend       |
                  +-------------------+
                           |
                           v
                  +-------------------+
                  | LangGraph         |
                  | Supervisor Agent  |
                  +-------------------+
                           |
                +----------+----------+
                |                     |
                v                     v
       +----------------+    +----------------+
       | Data Cleaner   |    | Visualizer     |
       | Agent          |    | Agent          |
       +----------------+    +----------------+
                |                     |
                v                     v
       +----------------+    +----------------+
       | Data Cleaning  |    | Chart Data     |
       | & Processing   |    | Generation     |
       +----------------+    +----------------+
                |                     |
                +----------+----------+
                           |
                           v
                  +-------------------+
                  |   Gemini API      |
                  |-------------------|
                  | AI-Powered Data   |
                  | Processing        |
                  +-------------------+
                           |
                           v
                  +-------------------+
                  |   FastAPI         |
                  |   Response        |
                  +-------------------+
                           |
                           v
                  +-------------------+
                  |   Chart.js        |
                  | Interactive Charts|
                  +-------------------+
                           |
                           v
                  +-------------------+
                  |   React.js        |
                  |   Dashboard       |
                  +-------------------+
                           |
                           v
                         USER

<h3>How It Works</h3>
<P>1.Data Upload: Users upload CSV files through the React.js frontend.</P>
<P>2.Backend Processing: FastAPI receives the files and prepares datasets for analysis.</P>
<P>3.Agent Orchestration: LangGraph Supervisor Agent coordinates specialized Data Cleaner and Visualizer agents.</P>
<P>4.Data Cleaning: The Data Cleaner Agent handles data preprocessing and identifies inconsistencies.</P>
<P>5.Data Analysis: The Visualizer Agent processes the cleaned data and prepares chart information.</P>
<P>6.AI Integration: Gemini API and LangChain support AI-powered data processing and analysis.</P>
<P>7.Visualization: Chart.js generates interactive visualizations that are displayed on the React.js dashboard.</P>
<h3>Project Structure</h3>

```bash
InsightFlow/
│
├── frontend/insightflow
│   └── src
│        ├── App.js
│        ├── App.css
│        ├──index.js
│        └──index.css
├── backend/
│   ├── main.py
│   └── agents.py
├── requirements.txt
├── .env.example
└── README.md
```
<h3>Use Cases</h3>
<li>Automated Visualization: Generate interactive charts and graphs from uploaded datasets.</li>
<li>AI-Powered Data Exploration: Leverage LangGraph agents and Gemini API to automate data processing and assist with data analysis.</li>
<li>Business Analytics: Analyze sales, revenue, and customer data to identify trends and support business decisions.</li>
