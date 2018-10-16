'use strict'
const {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
const { PieChart, Pie, Sector, Cell } = Recharts;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


//     peruspäiväraha + työmarkkinatuki sitten asumistuki + toimeentulotuki ja sen jälkeen siihen ansiosidonnainen


class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            map: {}
        }
    }
    async componentDidMount() {
        const data = await d3.csv("jtr-data.csv");
        const dataMap = {}
        data.columns.forEach((col,idx)=>{
            dataMap[col] = []
            Array.from(data).forEach(row=>{
                dataMap[col].push(row[col])
            })
        })
        this.setState({data: data, map: dataMap})
    }
    render() {
        return (
            <div>
                <h1>Jyväskylä Trail Runners kysely</h1>
                <p>
                Jyväskylä Trail Runners facebook-ryhmässä pyydettiin ihmisiä
                vastaamaan laadittuun kyselyyn. Vastausten määrä oli varsin hyvä 98
                vastausta 888 ryhmäläisen joukosta (lukumäärä tarkistettu 15.10.2018).
                </p>

                <Participants map={this.state.map}/>

            </div>
        );
    }
}

function counts(data) {
    return data.reduce((acc, value)=>{
        if (!acc[value]) acc[value]=0;
        acc[value]++
        return acc
    }, {})
}

class Participants extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let data = this.props.map['Ikä?'] || [];
        let ages = _.pairs(counts(data)).map(p=>{return { name: p[0], value: p[1]}})

        const RADIAN = Math.PI / 180;                    
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
 	    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy  + radius * Math.sin(-midAngle * RADIAN);
            
            return (
                    <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'}
     	                  dominantBaseline="central">
    	                {`${(percent * 100).toFixed(0)}% ${ages[index].name}v`}
                    </text>
            );
        }

  	return (
                <div>
                <h2>Vastaajien sukupuoli</h2>

    	        <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                <Pie data={ages} cx={300} cy={200} 
                     labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120} 
            fill="#8884d8"
                >
        	{
          	    data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                }
            </Pie>
                </PieChart>

                <h2>Vastaajien ikä</h2>
                </div>
        );
    }
}


ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
