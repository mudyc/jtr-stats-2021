'use strict'
const {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text} = Recharts;
const { PieChart, Pie, Sector, Cell } = Recharts;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const COLOR_MAP = {
    1: [ 'red'],
    2: ['#5ab4ac','#d8b365'],
    3: ['#e5f5f9',
        '#99d8c9',
        '#2ca25f',],
    4: ['#edf8fb',
        '#b2e2e2',
        '#66c2a4',
        '#238b45',],
    5: ['#a6611a',
        '#dfc27d',
        '#dddddd',
        '#80cdc1',
        '#018571'],
    6: ['#edf8fb',
        '#ccece6',
        '#99d8c9',
        '#66c2a4',
        '#2ca25f',
        '#006d2c'],
    9: ['#543005',
        '#8c510a',
        '#bf812d',
        '#dfc27d',
        '#f6e8c3',
        '#f5f5f5',
        '#c7eae5',
        '#80cdc1',
        '#35978f'],
    11: ['#543005',
         '#8c510a',
         '#bf812d',
         '#dfc27d',
         '#f6e8c3',
         '#f5f5f5',
         '#c7eae5',
         '#80cdc1',
         '#35978f',
         '#01665e',
         '#003c30']
}



class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            map: {}
        }
    }
    async componentDidMount() {
        const data = await d3.csv("jtr-data-2021.csv");
        const dataMap = {}
        data.columns.forEach((col,idx)=>{
            dataMap[col] = []
            Array.from(data).forEach(row=>{
                dataMap[col].push(row[col])
            })
        })
        console.log(dataMap);
        this.setState({data: data, map: dataMap})
    }
    render() {
        return (
            <div className="content">
                <img className="logo" src="metso.png"></img>
                <h1>Jyväskylä Trail Runners kysely</h1>
                <p>
                Jyväskylä Trail Runners facebook-ryhmässä pyydettiin ihmisiä
                vastaamaan laadittuun kyselyyn vuoden 2021 loppupuolella.
                Vastausten määrä oli 48kpl (2019: 63 kpl, 2018, 98 kpl)
                ryhmäläisten kokonaismäärä oli 1299 kpl (tarkastettu 6.1.2022, 2019: 1056 kpl, 2018: 888 kpl).
                </p>

                <Participants map={this.state.map}/>
                <hr noshade="" />
                <StartingLevel map={this.state.map}/>
                <hr noshade="" />
                <DreamsAndGoals map={this.state.map}/>
                <hr noshade="" />
                <Training map={this.state.map}/>
                <hr noshade="" />
                <BestInJTR map={this.state.map}/>
                <hr noshade="" />
                <LocalEvents map={this.state.map}/>
                <hr noshade="" />
                <h3>Yhteenveto</h3>
                Jyväskylä Trail Runners -ryhmän juoksija on keskimäärin keski-ikäinen
                joka ajaa viisi kertaan viikossa kello viiden
                jälkeen Halssilaan treenaamaan puoleksitoistatunniksi
                neulasbaanaa nauttiakseen luonnosta.
                Porukkalenkit ovat ryhmän parasta antia ja toki hän pitää niistä.
                Hän haaveilee polkujuoksusta tuntureilla muttei kykene siihen ajanpuutteen vuoksi.

            </div>
        );
    }
}

function counts(data) {
    return data.reduce((acc, value)=>{
        if (value == "") return acc
        if (!acc[value]) acc[value]=0;
        acc[value]++
        return acc
    }, {})
}

function multiCount(data) {

}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }, data) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN) + (index==0? -15:0);
    
    return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'}
                   dominantBaseline="central">
                {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
            </text>
    );
}

function sum(data) {
    return data.map(i=>Number.parseInt(i.value)).reduce((acc, value)=>acc + value, 0)
}
function sumNonEmpty(data) {
    return data.reduce((acc,value)=>acc+(value==""?0:1), 0)
}

class Participants extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let data = this.props.map['Ikä?'] || [];
        let ages = _.pairs(counts(data)).map(p=>{return { name: p[0], value: p[1]}})
        ages.sort((a,b)=>{ return a.name.localeCompare(b.name) })
        //if (ages.length)
        //    ages.push(ages.shift())

        let sex = _.pairs(counts(this.props.map['Sukupuoli?'] || [])).map(p=>{return { name: p[0], value: p[1]}})
        sex.sort()

        const sexLabel = params => renderCustomizedLabel(params, sex)
        const agesLabel = params => renderCustomizedLabel(params, ages)
      	return (
            <div>
                <h2>Kyselyn taustatiedot</h2>
                <h3>Vastaajien sukupuoli</h3>

    	        <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                    <Pie data={sex} cx={400} cy={200} 
                        labelLine={false}
                        label={sexLabel}
                        outerRadius={120} 
                        fill="#8884d8"
                    >
                        {
                            sex.map((entry, index) => <Cell fill={COLOR_MAP[sex.length][index]}/>)
                        }
                    </Pie>
                </PieChart>

                { sum(sex) } vastaajaa kertoi kyselyn alkutietoihin liittyvän sukupuolen. 

                <h3>Vastaajien ikä</h3>

    	        <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                    <Pie data={ages} cx={400} cy={200} 
                        labelLine={false}
                        label={agesLabel}
                        outerRadius={120} 
                        fill="#8884d8"
                    >
                        {
                        ages.map((entry, index) => <Cell fill={COLOR_MAP[ages.length][index]}/>)
                        }
                    </Pie>
                </PieChart>
                { sum(ages) } vastaajaa kertoi oman ikäryhmänsä. Pääosa juoksijoista on keski-iän molemmin puolin.

            </div>
        );
    }
}

class StartingLevel extends React.Component {
    
    render() {
        const best = '1km lenkin;5km lenkin;10km lenkin;puolimaratonin;maratonin;ultran'.split(';')
        let run = this.props.map['Olen juossut viimeisen vuoden aikana'] || []
        run = run.map(r=>{
            let nums = r.split(';').map(distance=>best.indexOf(distance))
            return best[Math.max(...nums)]
        })
        let runData = _.pairs(counts(run)).map(p=>{return { name: p[0], value: p[1]}})
        runData.sort((a,b)=>{
            return best.indexOf(a.name) - best.indexOf(b.name)
        })

        let sexSet = this.props.map['Sukupuoli?'] || []
        let combine = run.map((value, idx)=>{ return { sex: sexSet[idx], best: value } })

        let combinedData = best.map((distance)=>{
            return {
                name: distance,
                nainen: combine.reduce((acc, value)=>acc + (value.sex=='nainen' && value.best==distance && 1), 0),
                mies: combine.reduce((acc, value)=>acc + (value.sex=='mies' && value.best==distance && 1), 0)
            }
        })

        let fitnes = _.pairs(counts(this.props.map['Viimeisen vuoden aikana teen vähintään puolituntia kestävää liikuntaa'] || [])).map(p=>{return { name: p[0], value: p[1]}})
        const fitnesLabel = params => renderCustomizedLabel(params, fitnes)
        const fitnesSort = [
            "noin kerran viikossa",
            "yleensä kahdesti viikossa",
            "kolmesti viikossa",
            "neljästi viikossa",
            "viidesti viikossa",
            "kuudesti viikossa",
            "seitsemästi viikossa",
            "8 kertaa viikossa",
            "9 kertaa viikossa",
            "10 kertaa viikossa",
            "12 kertaa viikossa"]
        fitnes.sort((a,b) => fitnesSort.indexOf(a.name) - fitnesSort.indexOf(b.name))
        
        let cooperAll = this.props.map['Viimeisin Cooper-tulokseni (valitse lähin)'] || []
        const cooperX = cooperAll
            .map((value, idx)=>{ return { sex: sexSet[idx], value } })
            .filter(val => val.value != 'Ei tulosta' && val.value != '')
        const cooper = _.range(3500,2000,-100).map(t=>{
            const key = t+'m'
            naiset:
            return { len: key, 
                    nainen: cooperX.filter(v=>v.value==key && v.sex=='nainen').length,
                    mies: cooperX.filter(v=>v.value==key && v.sex=='mies').length,
            }
        })
        
      	return (
            <div>
                <h2>Lähtötaso</h2>
                <h3>Viimeisen vuoden aikana juostu (pisimmillään)</h3>

                <BarChart width={600} height={300} data={combinedData}
                    layout="vertical"
                    margin={{top: 5, right: 30, left: 90, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category"/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="nainen" fill="#9c0507" />
                    <Bar dataKey="mies" fill="#3a8887" />
                </BarChart>

                { sum(runData) } vastasi kuinka pitkälle on pisimmillään juossut viimeisen vuoden aikana.
                Aika tasaisesti sukupuoli jakautuu eri pituuksille. Vuonna 2019 miehet olivat 
                yliedustettuina ultrapitkillä.


                <h3>Viimeisen vuoden aikana teen vähintään puolituntia kestävää liikuntaa</h3>

    	        <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                    <Pie data={fitnes} cx={400} cy={200} 
                        labelLine={false}
                        label={fitnesLabel}
                        outerRadius={120} 
                        fill="#8884d8"
                        >
                        {
                            fitnes.map((entry, index) => <Cell fill={COLOR_MAP[fitnes.length][index]}/>)
                        }
                    </Pie>
                </PieChart>
                { sum(fitnes) } vastaajaa kertoi kuinka usein on liikkunut viikottain viimeisen vuoden aikana.
                Ryhmäläiset edustavat varsin liikkuvaa sakkia 💪
{/*
            */}
                <h3>Viimeisin Cooper tulokseni</h3>

                <img src="cooper.png" ></img>

                <BarChart width={800} height={400} data={cooper} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="len" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nainen" fill="#9c0507" />
                    <Bar dataKey="mies" fill="#3a8887" />
                </BarChart>

            </div>
        );
    }
}

function countListOptions(data, fixes={}){
    function fix(value) { const f = fixes[value]; if (f === '') return ''; return f || value }
    let all = []
    data.forEach(gs=>gs.split(';').forEach(g=>{ const h=fix(g); if (h != '') all.push(h)}))
    all = _.uniq(all)
    console.log(fixes, all)
    let counts = _.object(all.map(g=>[g, 0]))
    data.forEach(gs=>gs.split(';').forEach(g=>{ const h=fix(g); if (h != '') counts[h]++}))
    return _.pairs(counts).map(p=>{return { name: p[0], value: p[1]}})
}
class DreamsAndGoals extends React.Component {

    render() {
        let goal = this.props.map['Tavoitteenani on'] || []
        let goalsData = countListOptions(goal)
        goalsData.sort((a,b)=>b.value-a.value)

        let dream = this.props.map['Haaveissani olisi'] || []
        let dreamsData = countListOptions(dream)
        dreamsData.sort((a,b)=>b.value-a.value)
        let wall = this.props.map['Isoimmat esteet haaveilleni ovat kaiketi'] || []
        let wallsData = countListOptions(wall,{
            "Ei esteitä🤭": '',
            'Kisaan pääsee vain arvonnan kautta':'Arvonnat',
            'Covid':'Covid',
            'Covid 19 aiheuttamat rajoitteet':'Covid',
            'Sairastelu ja siitä hidas toipuminen':'Telakka',
            'sitkeä rasitusvamma':'Telakka',
            'ei mikään': '',
            'Samanaikauset muut tavoitteet. Jos kisa olisi omien triathlonkisojen kauden ulkopuolella (loka-marraskuu?) ja sopivan budjettinen matka löytyisi, niin hyvinkin mahdollista!':'Muut haaveet',
            'On olemassa muitakin haaveita ':'Muut haaveet',
            'Työ on vaativaa ja usein puhti pois.':'Elämäntilanne',
            'Elämäntilanne vaikkei ruuhkavuodet':'Elämäntilanne',
        })
        wallsData.sort((a,b)=>b.value-a.value)

        const customizedLabel = ({x, y, fill, value}) => {
                 return <text 
                         x={x} 
                         y={y} 
                         dy={-4} 
                         fontSize='16' 
                         fontFamily='sans-serif'
                         fill={fill}
                         textAnchor="middle">{value}%</text>
            }
      	return (
            <div>
                <h2>Haaveet ja tavoitteet</h2>
                <h3>Tavoitteenani juoksussa on</h3>

                <BarChart width={800} height={300} data={goalsData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 350, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category" tick={{width: 450 }} />
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                Tavoitteisiin vastasi { sumNonEmpty(goal) } juoksijaa.
                Tärkeimpänä tavoitteena pysyi viimevuodesta luonnosta nauttiminen.
                Uutena nousijana listalle kakkoseksi kiilasi omien haasteiden voittaminen.

                <h3>Haaveissani on juosta</h3>

                <BarChart width={800} height={300} data={dreamsData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 380, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category" tick={{width: 450 }} />
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                Saimme { sumNonEmpty(dream) } vastausta juoksijoiden haaveista.
                Suosituin haave oli polkujuoksu pohjoisessa Suomessa. Pohjoisessa 
                juokseminen on ensivuonnakin mahdollista osallistumalla esim. 
                Ylläs-Pallas-Hetta, Pyhän tai Kaldoaivin juoksuihin.
                Monesti ryhmässä sovitaan myös yhteiskyydeistä ja majoituksista.
                Saa myös ehdottaa omaa reittiä kunhan muistaa <a href="https://www.kiilopaa.fi/blogi/kirjoitus/2018/03/tunturivaeltajan-viisi-kaskya.html">säännöt</a>. 
                <p/>
                Kansallispuistoissa, retkeilyreitistöillä ja omilla reiteillä
                juoksemme jatkossakin pitkiksiä. Ne ovat yleensä melko rauhallisia,
                joten mukaan kannattaa lähteä rohkeasti.
                <p/>
                Maamme ulkopuolella järjestetään useita loistavia juoksukilpailuja.
                Kannattaa kysäistä näistä lisää esim. Anssilta, Tiinalta, Tommilta, Annalta tai Paavolta.

                <h3>Suurimmat esteet haaveilleni ovat</h3>

                <BarChart width={800} height={500} data={wallsData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 250, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category" tick={{width: 450 }} />
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                { sumNonEmpty(wall) } vastasi suurimpiin esteisiin haaveiden toteuttamiseen.
                Suurin este harrastuksille on ajanpuute.
                Huomioitava vastaus on myös kaverin puute ja ei uskalla kulkea yksin.
                Toivottavasti tulevaisuudessa löytyy enemmän kavereita haaveita tukemaan.
            </div>
        );
    }
}

class Training extends React.Component {
    render() {

        let participated = _.pairs(counts(this.props.map['Olen käynyt yhteislenkillä'] || [])).map(p=>{return { name: p[0], value: p[1]}})
        const participatedLabel = params => renderCustomizedLabel(params, participated)

        let training = this.props.map['Yhteislenkki oli (jos osallistuit)'] || []
        let trainingData = countListOptions(training)
        trainingData.sort((a,b)=>b.value-a.value)

        let place = this.props.map['Minulle käteviä treenipaikkoja olisivat'] || []
        place = place.map(p=>p.replace(', ',';').replace(/ /g, ' ').replace('!',''))
        let placeData = countListOptions(place)
        placeData.sort((a,b)=>b.value-a.value)
        console.log(place, placeData)
        const rem = [
            'Ihan sama - kaikki on hyvä',
            'autolla pääsee',
            'Kaikki käy',
            'Jos hyvissä ajoin tietää',
            'niin pääsee autollakin muualle.',
            'Missä vaan on polkua :)',
            'Kimppakyydillä käy kaikki. Pyörällä lähimaastot. '
        ]
        rem.forEach(del => placeData.splice(placeData.findIndex(elem => elem.name===del), 1))
        //placeData = placeData.splice(0,10)

        let logistics = this.props.map['Käyn treeneissä yleensä'] || []
        let logisticsData = countListOptions(logistics)
        logisticsData.sort((a,b)=>b.value-a.value)
        logisticsData.pop()
        //logisticsData.pop()

        const times = ["5-7", "7-10", "10-12", "12-15", "15-17", "17-19", "19-21", ">21"]

        let arki = {
            Maanantai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Maanantai]',
            Tiistai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Tiistai]',
            Keskiviikko: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Keskiviikko]',
            Torstai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Torstai]',
            Perjantai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Perjantai]'
        }
        Object.keys(arki).forEach(day=>{ arki[day] = countListOptions(this.props.map[arki[day]] || []) })
        const arkiData = times.map(time=>{
            let ret = { name: time }
            Object.keys(arki).forEach(day=>{
                ret[day] = (_.find(arki[day], { name: time}) || {}).value
            })
            return ret
        })

        let weekend = {
            Lauantai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Lauantai]',
            Sunnuntai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Sunnuntai]',
        }
        Object.keys(weekend).forEach(day=>{ weekend[day] = countListOptions(this.props.map[weekend[day]] || []) })
        const weekendData = times.map(time=>{
            let ret = { name: time }
            Object.keys(weekend).forEach(day=>{
                ret[day] = (_.find(weekend[day], { name: time}) || {}).value
            })
            return ret
        })

        
        let duration = this.props.map['Treenimääränä minusta olisi optimaalinen'] || []
        let durationData = countListOptions(duration)
        const order = ["30 min", "45 min", "1 h", "1 h 30 min", "2 h", "2 h 30 min"]
        durationData.sort((a,b)=>order.indexOf(a.name)-order.indexOf(b.name))

        let power = this.props.map['Treenin tehokkuus tulisi olla mielestäni'] || []
        let powerData = countListOptions(power)
        powerData.sort((a,b)=>b.value-a.value)
        //powerData = powerData.splice(0,6)


        let ground = this.props.map['Treenimaaston tulisi sisältää'] || []
        let groundData = countListOptions(ground)
        groundData.sort((a,b)=>b.value-a.value)
        
        let communication = this.props.map['Treeneistä tulisi ilmoittaa'] || []
        let communicationData = countListOptions(communication)
        communicationData.sort((a,b)=>b.value-a.value)

        return (
            <div>
                <h2>Lähitreenit</h2>
                <h3>Olen käynyt yhteislenkillä</h3>

                <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                    <Pie data={participated} cx={400} cy={200} 
                        labelLine={false}
                        label={participatedLabel}
                        outerRadius={120} 
                        fill="#8884d8"
                    >
                        {
                            participated.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                        }
                    </Pie>
                </PieChart>

                { sum(participated)} vastasi oliko osallistunut jo yhteislenkille. Selvästi miettimisen
                paikka miten saisimme aktivoitua loputkin juoksijat yhteisletkaan 🤔

                <h3>Yhteislenkki oli mielestäni</h3>

                <BarChart width={800} height={300} data={trainingData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 380, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category" tick={{width: 450 }} />
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                Saimme { sumNonEmpty(training) } vastausta miltä yhteislenkki maistui.
                Olemme onnistuneet pääosin ja rohkaisen kaikkia jatkossa järjestämään yhteislenkkejä niin saadaan eri pituisia ja nopeuksisia lenkkejä.
                Kengät saa jatkossakin kastua 😂

                <h3>Kätevät treenipaikat</h3>

                <BarChart width={800} height={600} data={placeData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 250, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category" tick={{width: 450 }} />
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                { sumNonEmpty(place) } vastaajan mukaan Halssila on toista vuotta peräkkäin treenipaikka.
                Kanavuori nokitti kakkoseksi Vaajakosken kanssa!

                <h3>Logistiikka - siirtyminen treenipaikalle</h3>

                <BarChart width={800} height={300} data={logisticsData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 150, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category" tick={{width: 450 }} />
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                Valtaosa juoksijoista tekee siirtymät treenimestoille omalla autolla.
                Kyytiä tarvitsevat muistakaa jatkossakin kysellä ryhmässä,
                tämän tilaston valossa kyydin saanti on hyvin todennäköistä.

                <h3>Paras treeniaika</h3>

                <BarChart width={800} height={300} data={arkiData}
                    margin={{top: 5, right: 30, left: 30, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <YAxis type="number"/>
                    <XAxis dataKey="name" type="category"/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="Maanantai" fill={COLOR_MAP[5][0]} />
                    <Bar dataKey="Tiistai" fill={COLOR_MAP[5][1]} />
                    <Bar dataKey="Keskiviikko" fill={COLOR_MAP[5][2]} />
                    <Bar dataKey="Torstai" fill={COLOR_MAP[5][3]} />
                    <Bar dataKey="Perjantai" fill={COLOR_MAP[5][4]} />
                </BarChart>

                <BarChart width={800} height={300} data={weekendData}
                    margin={{top: 5, right: 30, left: 30, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <YAxis type="number"/>
                    <XAxis dataKey="name" type="category"/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="Lauantai" fill={COLORS[0]} />
                    <Bar dataKey="Sunnuntai" fill={COLORS[1]} />
                </BarChart>

                Parasta treeniaika jakaantuu kahteen osaan arkeen ja viikonloppuun. Arkena aikaa treenille näyttää olevan klo 17-19 tai viimeistään 19-21.
                Viikonloppuna aikaa harrastelulle on vaikka koko päivän.

                <h3>Treenien sopiva kesto ajallisesti</h3>

                <BarChart width={800} height={300} data={durationData}
                    margin={{top: 5, right: 30, left: 30, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <YAxis type="number"/>
                    <XAxis dataKey="name" type="category"/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                <h3>Treenien sopiva tehokkuus</h3>

                <BarChart width={800} height={500} data={powerData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 450, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category"  tick={{width: 450 }}/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>


                <h2>Polkupohja</h2>

                <BarChart width={800} height={300} data={groundData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 150, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category"  tick={{width: 450 }}/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

                Kummallisesti neulasbaana voitti parkettikisan.

                <h2>Harjoitusten ilmoitusaika</h2>

                <BarChart width={800} height={300} data={communicationData}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 400, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category"  tick={{width: 450 }}/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

            </div>
        );
    }
}

class BestInJTR extends React.Component {
    render() {

        let best = this.props.map['Parasta yhteistoimintaa on ollut'] || []
        best = countListOptions(best, {
            'Riikan ja Petterin 50v juoksut':'Riikan ja Petterin 50v backyard :)',
            'Muutkin varmasti, mutta pikkujoulujen päivä on osunut töiden kanssa päällekkäin ja kisamatkoilla majoitus on ollut muulta käsin. Mukava siellä on ollut nähdä tuttuja kasvoja. ':'Muut',
        })
        best.sort((a,b)=>b.value - a.value)
        const bestLabel = params => renderCustomizedLabel(params, best)
console.log(best)

        return (
            <div>
                <h2>Parasta Jyväskylä Trail Runners toiminnassa on vuonna 2021 ollut</h2>

                <BarChart width={800} height={300} data={best}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 400, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category"  tick={{width: 450 }}/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

            </div>
        );
    }
}

class LocalEvents extends React.Component {
    render() {

        let localEvent = _.pairs(counts(this.props.map['Osallistuin paikalliskisaan?'] || [])).map(p=>{return { name: p[0], value: p[1]}})
        const localEventLabel = params => renderCustomizedLabel(params, localEvent)


        let ifevent = this.props.map['Jos Jyväskylässä järjestettäisiin polkujuoksukisa, niin...'] || []
        ifevent = countListOptions(ifevent, {
            'Riikan ja Petterin 50v juoksut':'Riikan ja Petterin 50v backyard :)',
            'Muutkin varmasti, mutta pikkujoulujen päivä on osunut töiden kanssa päällekkäin ja kisamatkoilla majoitus on ollut muulta käsin. Mukava siellä on ollut nähdä tuttuja kasvoja. ':'Muut',
        })
        ifevent.sort((a,b)=>b.value - a.value)

        return (
            <div>
                <h2>Olen osallistunut paikalliskisaan?</h2>

                <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                    <Pie data={localEvent} cx={400} cy={200} 
                        labelLine={false}
                        label={localEventLabel}
                        outerRadius={120} 
                        fill="#8884d8"
                    >
                        {
                            localEvent.map((entry, index) => <Cell fill={COLOR_MAP[localEvent.length][index]}/>)
                        }
                    </Pie>
                </PieChart>


                <h2>Jos Jyväskylässä järjestettäisiin kisa...</h2>

                <BarChart width={800} height={300} data={ifevent}
                    layout="vertical" 
                    margin={{top: 5, right: 30, left: 400, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category"  tick={{width: 450 }}/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#3a8887" />
                </BarChart>

            </div>
        );
    }
}


ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
