from langgraph.graph import MessagesState,StateGraph,END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage,AIMessage,HumanMessage
from typing import Literal
import pandas as pd

class Agentstate(MessagesState):
  data_cleaner:bool=False
  visualizer:bool=False
  nxt_agent:str

llm=ChatGoogleGenerativeAI(model='gemini-3.5-flash-lite',
            api_key=GOOGLE_API_KEY)

def supervisor_node(State:Agentstate):
  """Decide which agent should execute next."""
  message = State["messages"]
  sys_msg = f"""
  You are the supervisor of two agents.Data cleaner and Visualizer

  the following tells that the agent completed its task or not:
    Data cleaner completed: {State.get('data_cleaner', False)}
    Visualizer completed: {State.get('visualizer', False)}

  Rules:
  - If data cleaning is incomplete, respond with data_cleaner.
  - If cleaning is complete but visualization is incomplete,
    respond with visualizer.
  - If both are complete, respond with done.

  Respond with exactly one of:
  data_cleaner, visualizer, done
  """
  msg=[SystemMessage(content=sys_msg)]+message
  res=llm.invoke(msg)
  last_msg=res.content.strip().lower()

  if "data_cleaner" in last_msg:
      nxt = "data_cleaner"
  elif "visualizer" in last_msg:
      nxt = "visualizer"
  elif "done" in last_msg:
      nxt = "done"
  else:
        nxt = "done"

  return{
      'messages':message,
      'nxt_agent':nxt
  }

def data_cleaner(State:Agentstate):
  '''Cleaner agent. responsible for removing false or null data'''
  message=State['messages']
  sys_msg='''Act as a senior data cleaner.
    Clean the supplied data for visualization.
    Handle missing values, invalid records, duplicates,
    and inconsistent formats where appropriate.
    Preserve meaningful information and explain any
    assumptions made.'''
  msg=[SystemMessage(content=sys_msg)]+message
  res=llm.invoke(msg)

  return{
      'messages':[res],
      'data_cleaner':True,
      'nxt_agent':'supervisor_node',
  }

def visualizer(State:Agentstate):
  '''visulizer agent. responsible for visulizating data'''
  message=State['messages']
  sys_msg="""
    You are an expert data visualization agent.

    Analyze the provided data and generate exactly THREE chart configurations:

    1. Line chart
    2. Pie chart
    3. Bar chart

    Return the output strictly as a valid JSON array.

    Follow this exact structure:

    [
        {
            "chart": {
                "type": "line",
                "title": "Chart title",
                "xlabel": "X-axis label",
                "ylabel": "Y-axis label",
                "xdata": [],
                "ydata": []
            }
        },
        {
            "chart": {
                "type": "pie",
                "title": "Chart title",
                "label": [],
                "data": []
            }
        },
        {
            "chart": {
                "type": "bar",
                "title": "Chart title",
                "xlabel": "X-axis label",
                "ylabel": "Y-axis label",
                "xdata": [],
                "ydata": []
            }
        }
    ]

    Rules:
    - Ensure xdata and ydata have matching lengths.
    - Ensure pie labels and data have matching lengths.
    - Choose meaningful chart titles and axis labels.
    - If a chart cannot be generated from the available data,
      return empty arrays for that chart.
    - The pie chart should have atleast two data along with proper label for that data.
    - Return JSON only.
    """
  
  msg=[SystemMessage(content=sys_msg)]+message
  res=llm.invoke(msg) 
  return{
      'messages':[res],
      'visualizer':True,
      'nxt_agent':'supervisor_node'
  }

def router(State:Agentstate) -> Literal['supervisor_node','data_cleaner','visualizer','done']:
  return State['nxt_agent']

workflow=StateGraph(Agentstate)

workflow.add_node('supervisor_node',supervisor_node)
workflow.add_node('data_cleaner',data_cleaner)
workflow.add_node('visualizer',visualizer)

workflow.set_entry_point('supervisor_node')
workflow.add_conditional_edges(
    'supervisor_node',
    router,
    {
        'data_cleaner':'data_cleaner',
        'visualizer':'visualizer',
        'done':END
    }
)
workflow.add_edge('data_cleaner','supervisor_node')
workflow.add_edge('visualizer','supervisor_node')

graph=workflow.compile()

def workflow(data):
  data1=pd.read_csv(data)
  data=data1.head(10)
  res=graph.invoke({'messages':f'{data}'})
  res=res['messages'][-1].content

  return res