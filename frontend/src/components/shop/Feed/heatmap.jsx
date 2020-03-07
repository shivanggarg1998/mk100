import React from "react";
import { render } from "react-dom";
import { Map, TileLayer, Rectangle } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import "leaflet/dist/leaflet.css";
import { getfirebase } from "../../../push-notification";
import { addressPoints } from "./realworld.1000.js";
import L from "leaflet";
import Autocomplete from "react-autocomplete";
import {
  dashboard24HoursPerformanceChart,
  dashboard24HoursPerformanceChartKerala,
  dashboard24HoursPerformanceChartBihar,
  dashboard24HoursPerformanceChartChattisgarh,
  dashboard24HoursPerformanceChartPunjab,
  dashboard24HoursPerformanceChartTripura,
  dashboard24HoursPerformanceChartMaharastra,
  dashboard24HoursPerformanceChartRajasthan,
  dashboard24HoursPerformanceChartManipur,
  dashboard24HoursPerformanceChartAssam,
  dashboard24HoursPerformanceChartWB,
  dashboard24HoursPerformanceChartOrrisa,
  dashboard24HoursPerformanceChartUP,
  dashboard24HoursPerformanceChartHP,
  dashboard24HoursPerformanceChartMP,
  dashboard24HoursPerformanceChartGujarat,
  dashboard24HoursPerformanceChartTN,
  dashboard24HoursPerformanceChartMizoram,
  dashboard24HoursPerformanceChartJK,
  dashboard24HoursPerformanceChartSikkim,
  dashboard24HoursPerformanceChartKarnatka,
  dashboard24HoursPerformanceChartNagaland,
  dashboard24HoursPerformanceChartArunachal,
  dashboard24HoursPerformanceChartUttrakhand,
  dashboard24HoursPerformanceChartHaryana,
  dashboard24HoursPerformanceChartMeghalaya,
  dashboard24HoursPerformanceChartJharkhand,
} from "./charts.jsx";

import { Bar } from 'react-chartjs-2';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import CardCategory from './CardCategory';
import image from "./grass1.jpeg"

import Weather from './weather';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const cities = [
  { name: "Rajasthan", coordinates: [74.2179, 27.0238] },
  { name: "Kerala", coordinates: [76.2711, 10.8505] },
  { name: "Chattisgarh", coordinates: [81.8661, 21.2787] },
  { name: "Andhra Pradesh", coordinates: [80.0193, 17.1124] },
  { name: "Madhya Pradesh", coordinates: [78.6569, 22.9734] },
  { name: "Gujarat", coordinates: [71.1924, 22.2587] },
  { name: "Maharastra", coordinates: [75.7139, 19.7515] },
  { name: "Uttar Pradesh", coordinates: [80.9462, 26.8467] },
  { name: "Tamil Nadu", coordinates: [78.656891, 11.127123] },
  { name: "Orissa", coordinates: [84.803467, 20.94092] },
  { name: "West Bengal", coordinates: [87.747803, 22.978624] },
  { name: "Assam", coordinates: [92.537842, 26.244156] },
  { name: "Himachal Pradesh", coordinates: [77.571167, 32.084206] },
  { name: "Tripura", coordinates: [91.746826, 23.745127] },
  { name: "Mizoram", coordinates: [92.9376, 23.1645] },
  { name: "Manipur", coordinates: [93.9063, 24.6637] },
  { name: "Punjab", coordinates: [75.3412, 31.1471] },
  { name: "Bihar", coordinates: [85.3131, 25.0961] },
  { name: "Jammu and Kashmir", coordinates: [74.797371, 34.083656] },
  { name: "Nagaland", coordinates: [94.5624, 26.1584] },
  { name: "Sikkim", coordinates: [88.5122, 27.533] },
  { name: "Karnataka", coordinates: [75.7139, 15.3173] },
  { name: "Jharkhand", coordinates: [85.2799, 23.6102] },
  { name: "Uttrakhand", coordinates: [79.0193, 30.0668] },
  { name: "Haryana", coordinates: [76.0856, 29.0588] },
  { name: "Meghalaya", coordinates: [91.3662, 25.467] },
  { name: "Arunachal Pradesh", coordinates: [94.7278, 28.218] }
];
function Greeting(isLoggedIn) {
  isLoggedIn = isLoggedIn.isLoggedIn;
  if (isLoggedIn == "Orissa") return <Orissa />;
  if (isLoggedIn == "Chattisgarh") return <Chattisgarh />;
  if (isLoggedIn == "Madhya Pradesh") return <MP />;
  if (isLoggedIn == "West Bengal") return <WB />;
  if (isLoggedIn == "Bihar") return <Bihar />;
  if (isLoggedIn == "Uttar Pradesh") return <UP />;
  if (isLoggedIn == "Rajasthan") return <Rajasthan />;
  if (isLoggedIn == "Gujarat") return <Gujarat />;
  if (isLoggedIn == "Maharastra") return <Maharastra />;
  if (isLoggedIn == 1288) return <AP />;
  if (isLoggedIn == 1317) return <TN />;
  if (isLoggedIn == 1304) return <Kerala />;
  if (isLoggedIn == 1290) return <Assam />;
  if (isLoggedIn == 1308) return <Manipur />;
  if (isLoggedIn == 1310) return <Mizoram />;
  if (isLoggedIn == 1318) return <Tripura />;
  if (isLoggedIn == 1300) return <HP />;
  if (isLoggedIn == 1301) return <JK />;
  if (isLoggedIn == 1316) return <Sikkim />;
  if (isLoggedIn == 1311) return <Nagaland />;
  if (isLoggedIn == 1303) return <Karnataka />;
  if (isLoggedIn == 1314) return <Punjab />;
  if (isLoggedIn == 1320) return <Uttrakhand />;
  if (isLoggedIn == 1299) return <Haryana />;
  if (isLoggedIn == 1289) return <Arunachal />;
  if (isLoggedIn == 1302) return <Jharkhand />;
  if (isLoggedIn == 1309) return <Meghalaya />;
  else return <h4 style={{ margin: '0 auto', width: '340px' }}> Select state to see data</h4>;
}
class Orissa extends React.Component {
  render() {
    return (
      <div>
        <Bar
          data={dashboard24HoursPerformanceChartOrrisa.data}
          options={dashboard24HoursPerformanceChartOrrisa.options}
        />
        ;
      </div>
    );
  }
}

function Chattisgarh() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartChattisgarh.data}
        options={dashboard24HoursPerformanceChartChattisgarh.options}
      />
      ;
    </div>
  );
}
function Uttrakhand() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartUttrakhand.data}
        options={dashboard24HoursPerformanceChartUttrakhand.options}
      />
      ;
    </div>
  );
}
function Jharkhand() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartJharkhand.data}
        options={dashboard24HoursPerformanceChartJharkhand.options}
      />
      ;
    </div>
  );
}
function Meghalaya() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartMeghalaya.data}
        options={dashboard24HoursPerformanceChartMeghalaya.options}
      />
      ;
    </div>
  );
}
function Haryana() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartHaryana.data}
        options={dashboard24HoursPerformanceChartHaryana.options}
      />
      ;
    </div>
  );
}
function Arunachal() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartArunachal.data}
        options={dashboard24HoursPerformanceChartArunachal.options}
      />
      ;
    </div>
  );
}
function MP() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartMP.data}
        options={dashboard24HoursPerformanceChartMP.options}
      />
      ;
    </div>
  );
}
function JK() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartJK.data}
        options={dashboard24HoursPerformanceChartJK.options}
      />
      ;
    </div>
  );
}
function Sikkim() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartSikkim.data}
        options={dashboard24HoursPerformanceChartSikkim.options}
      />
      ;
    </div>
  );
}
function Karnataka() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartKarnatka.data}
        options={dashboard24HoursPerformanceChartKarnatka.options}
      />
      ;
    </div>
  );
}
function Nagaland() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartNagaland.data}
        options={dashboard24HoursPerformanceChartNagaland.options}
      />
      ;
    </div>
  );
}
function WB() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartWB.data}
        options={dashboard24HoursPerformanceChartWB.options}
      />
      ;
    </div>
  );
}
function Bihar() {
  console.log("entered bihar");
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartBihar.data}
        options={dashboard24HoursPerformanceChartBihar.options}
      />
      ;
    </div>
  );
}
function UP() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartUP.data}
        options={dashboard24HoursPerformanceChartUP.options}
      />
      ;
    </div>
  );
}
function Rajasthan() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartRajasthan.data}
        options={dashboard24HoursPerformanceChartRajasthan.options}
      />
      ;
    </div>
  );
}
function Gujarat() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartGujarat.data}
        options={dashboard24HoursPerformanceChartGujarat.options}
      />
      ;
    </div>
  );
}
function Maharastra() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartMaharastra.data}
        options={dashboard24HoursPerformanceChartMaharastra.options}
      />
      ;
    </div>
  );
}
function AP() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChart.data}
        options={dashboard24HoursPerformanceChart.options}
      />
      ;
    </div>
  );
}
function TN() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartTN.data}
        options={dashboard24HoursPerformanceChartTN.options}
      />
      ;
    </div>
  );
}
function Kerala() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartKerala.data}
        options={dashboard24HoursPerformanceChartKerala.options}
      />
      ;
    </div>
  );
}
function Assam() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartAssam.data}
        options={dashboard24HoursPerformanceChartAssam.options}
      />
      ;
    </div>
  );
}
function Manipur() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartManipur.data}
        options={dashboard24HoursPerformanceChartManipur.options}
      />
      ;
    </div>
  );
}
function Mizoram() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartMizoram.data}
        options={dashboard24HoursPerformanceChartMizoram.options}
      />
      ;
    </div>
  );
}
function Tripura() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartTripura.data}
        options={dashboard24HoursPerformanceChartTripura.options}
      />
      ;
    </div>
  );
}
function HP() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartHP.data}
        options={dashboard24HoursPerformanceChartHP.options}
      />
      ;
    </div>
  );
}
function Punjab() {
  return (
    <div>
      <Bar
        data={dashboard24HoursPerformanceChartPunjab.data}
        options={dashboard24HoursPerformanceChartPunjab.options}
      />
      ;
    </div>
  );
}
function List(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn == "Rice") return <Rice />;
  if (isLoggedIn == "Wheat") return <Wheat />;
  if (isLoggedIn == "Raagi") return <Raagi />;
  if (isLoggedIn == "Maize") return <Maize />;
  else return <Raagi />;
}
function Raagi() {
  return (
    <div
      style={{
        marginTop: "0px",
        marginLeft: "0px",
        width: "95%",
        height: "10%"
      }}
    >
      <Card
        className="card-chart"
        style={{
          marginTop: "0px",
          marginLeft: "0px",
          width: "98.7%",
          height: "1020%",
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
        }}
      >
        <CardHeader style={{
          paddingTop: '0px',
          paddingLeft: '30px'
        }}>
          <CardCategory><h4>Best producer states for Raagi</h4></CardCategory>
          <CardTitle tag="h4" />
        </CardHeader>
        <CardBody >
          <h5 style={{ marginLeft: '55px' }}><pre>Rajasthan        84%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Karnataka        81%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Andhra Pradesh   75%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Tamil Nadu       73%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Odisha           58%</pre></h5>
        </CardBody>
      </Card>
    </div>
  );
}

function Rice() {
  return (
    <div
      style={{
        marginTop: "0px",
        marginLeft: "0px",
        width: "95%",
        height: "10%"
      }}
    >
      <Card
        className="card-chart"
        style={{
          marginTop: "0px",
          marginLeft: "0px",
          width: "98.7%",
          height: "1020%",
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden'
        }}
      >
        <CardHeader style={{
          paddingTop: '0px',
          paddingLeft: '30px'
        }}>
          <CardCategory><h4>Best producer states for Rice</h4></CardCategory>
          <CardTitle tag="h4" />
        </CardHeader>
        <CardBody>
          <h5 style={{ marginLeft: '55px' }}><pre>Karnataka        87%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Assam            85%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Odisha           83%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Chattisgarh      76%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Bihar            72%</pre></h5>
        </CardBody>
      </Card>
    </div >
  );
}

function Wheat() {
  return (
    <div
      style={{
        marginTop: "0px",
        marginLeft: "0px",
        width: "95%",
        height: "10%"
      }}
    >
      <Card
        className="card-chart"
        style={{
          marginTop: "0px",
          marginLeft: "0px",
          width: "98.7%",
          height: "1020%",
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden'
        }}
      >
        <CardHeader style={{
          paddingTop: '0px',
          paddingLeft: '30px'
        }}>
          <CardCategory><h4>Best producer states for Wheat</h4></CardCategory>
          <CardTitle tag="h4" />
        </CardHeader>
        <CardBody>
          <h5 style={{ marginLeft: '55px' }}><pre>Uttar Pradesh      65%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Punjab             59%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Madhya Pradesh     52%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Haryana            42%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Rajasthan          39%</pre></h5>
        </CardBody>
      </Card>
    </div>
  );
}

function Maize() {
  return (
    <div
      style={{
        marginTop: "0px",
        marginLeft: "0px",
        width: "95%",
        height: "10%"
      }}
    >
      <Card
        className="card-chart"
        style={{
          marginTop: "0px",
          marginLeft: "0px",
          width: "98.7%",
          height: "1020%",
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden'
        }}
      >
        <CardHeader style={{
          paddingTop: '0px',
          paddingLeft: '30px'
        }}>
          <CardCategory><h4>Best producer states for Maize</h4></CardCategory>
          <CardTitle tag="h4" />
        </CardHeader>
        <CardBody>
          <h5 style={{ marginLeft: '55px' }}><pre>Karnataka        90%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Rajasthan        86%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Madhya Pradesh   84%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Maharastra       78%</pre></h5>
          <h5 style={{ marginLeft: '55px' }}><pre>Uttar Pradesh    59%</pre></h5>
        </CardBody>
      </Card>
    </div>
  );
}


class MapExample extends React.Component {
  state = {
    mapHidden: false,
    layerHidden: false,
    addressPoints,
    radius: 7,
    blur: 8,
    max: 0.5,
    limitAddressPoints: true,
    coordinates: [80.9462, 23.8467],
    casespoint: [],
    casespoint1: [],
    casespoint2: [],
    casespoint3: [],
    position: [[1, 1]],
    data: "",
    dataselected: "",
  };

  /**
   * Toggle limiting the address points to test behavior with refocusing/zooming when data points change
   */
  toggleLimitedAddressPoints() {
    if (this.state.limitAddressPoints) {
      this.setState({
        addressPoints: addressPoints.slice(500, 1000),
        limitAddressPoints: false
      });
    } else {
      this.setState({ addressPoints, limitAddressPoints: true });
    }
  }
  componentDidMount() {
    var firebase = getfirebase();
    firebase
      .database()
      .ref("cases")
      .on("value", snapshot => {
        this.setState({
          casespoint: [Object.entries(snapshot.val()).filter((data) => {
            if (data[1].isweb == 1) {
              return data[1];
            }
          })],
          casespoint1: [Object.entries(snapshot.val()).filter((data) => {
            if (data[1].isweb == 2) {
              return data[1];
            }
          })],
          casespoint2: [Object.entries(snapshot.val()).filter((data) => {
            if (data[1].isweb == 3) {
              return data[1];
            }
          })],
          casespoint3: [Object.entries(snapshot.val()).filter((data) => {
            if (data[1].isweb == 4) {
              return data[1];
            }
          })]
        })
      })
  }

  deletemarker(value) {
    console.log("hhh");
    var temp = this.state.position;
    var index = temp.indexOf(value);
    if (index !== -1) temp.splice(index, 1);
    this.setState({
      position: temp
    });
  }
  render() {
    if (this.state.mapHidden) {
      return (
        <div>
          <input
            type="button"
            value="Toggle Map"
            onClick={() => this.setState({ mapHidden: !this.state.mapHidden })}
          />
        </div>
      );
    }

    const gradient = {
      '0.00': 'rgb(255,0,255)',
      '0.25': 'rgb(0,0,255)',
      '0.50': 'rgb(0,255,0)',
      '0.75': 'rgb(255,255,0)',
      '1.00': 'rgb(255,0,0)'
    }
    const gradient1 = {
      '0.0': 'rgb(0, 0, 0)',
      '0.6': 'rgb(24, 53, 103)',
      '0.75': 'rgb(46, 100, 158)',
      '0.9': 'rgb(23, 173, 203)',
      '1.0': 'rgb(0, 250, 250)'
    }
    return (
      <div className="app">
        <div style={{ height: '620px' }}>

          <Map
            style={{ height: "100%", margin: "10px" }}
            center={[this.state.coordinates[1], this.state.coordinates[0]]}
            zoom={6}
            doubleClickZoom={false}
          >
            {console.log('a', this.state.data)}
            {(this.state.dataselected == "Raagi" || this.state.dataselected == "All") ?
              <HeatmapLayer
                points={this.state.casespoint[0]}
                longitudeExtractor={m => m[1].addresslng}
                latitudeExtractor={m => m[1].addresslat}
                gradient={gradient}
                intensityExtractor={m => 10000}
                radius={Number(this.state.radius)}
                blur={Number(this.state.blur)}
                max={Number.parseFloat(this.state.max)}
              /> : ""}
            {(this.state.dataselected == "Wheat" || this.state.dataselected == "All") ?
              <HeatmapLayer
                points={this.state.casespoint2[0]}
                longitudeExtractor={m => m[1].addresslng}
                latitudeExtractor={m => m[1].addresslat}
                gradient={gradient}
                intensityExtractor={m => 10000}
                radius={Number(this.state.radius)}
                blur={Number(this.state.blur)}
                max={Number.parseFloat(this.state.max)}
              /> : ""}
            {(this.state.dataselected == "Rice" || this.state.dataselected == "All") ?
              <HeatmapLayer
                points={this.state.casespoint3[0]}
                longitudeExtractor={m => m[1].addresslng}
                latitudeExtractor={m => m[1].addresslat}
                gradient={gradient}
                intensityExtractor={m => 10000}
                radius={Number(this.state.radius)}
                blur={Number(this.state.blur)}
                max={Number.parseFloat(this.state.max)}
              /> : ""}
            {(this.state.dataselected == "Maize" || this.state.dataselected == "All") ?
              <HeatmapLayer
                points={this.state.casespoint1[0]}
                longitudeExtractor={m => m[1].addresslng}
                latitudeExtractor={m => m[1].addresslat}
                gradient={gradient1}
                intensityExtractor={m => 10000}
                radius={Number(this.state.radius)}
                blur={Number(this.state.blur)}
                max={Number.parseFloat(this.state.max)}
              /> : ""
            }
            <div style={{ width: '25%', float: 'right', zIndex: 501, position: 'relative', marginLeft: '-23px', marginTop: '20px' }}>
              <List isLoggedIn={this.state.dataselected} />
            </div>

            <Row style={{ margin: '30px', zIndex: 502, position: 'relative' }}>
              <Col md={3}>
                <form>
                  <Autocomplete
                    getItemValue={item => item}
                    items={[
                      "Raagi",
                      "Rice",
                      "Wheat",
                      "Maize",
                      "All"
                    ]}
                    shouldItemRender={(item, value) =>
                      item.slice(0, value.length).toLowerCase() ==
                      value.toLowerCase()
                    }
                    renderItem={(item, isHighlighted) => {
                      return (
                        <div className="form-control" style={{ align: "center", fontSize: "14px", borderRadius: "0", background: "rgba(255,255,255,1)", color: "black" }}>
                          {item}
                        </div>
                      );
                    }}
                    value={this.state.val1}
                    onChange={e => this.setState({ val1: e.target.value })}
                    onSelect={val => {
                      this.setState({ dataselected: val, val1: val });
                    }}
                    wrapperProps={{
                      className: "no-border input-group",
                      style: { align: "center" }
                    }}
                    inputProps={{
                      className: "form-control",
                      placeholder: "Select the crop to be bought",
                      style: { marginBottom: "5px", borderRadius: "30px", align: "center", backgroundColor: 'white' }
                    }}
                  />
                </form>
              </Col>
              <Col md={3}>
                <form>
                  <Autocomplete
                    getItemValue={item => item}
                    items={[
                      "Andhra Pradesh",
                      "Arunachal Pradesh",
                      "Assam",
                      "Bihar",
                      "Chattisgarh",
                      "Goa",
                      "Gujarat",
                      "Haryana",
                      "Himachal Pradesh",
                      "Jammu And Kashmir",
                      "Jharkhand",
                      "Karnataka",
                      "Kerala",
                      "Madhya Pradesh",
                      "Maharashtra",
                      "Manipur",
                      "Meghalaya",
                      "Mizoram",
                      "Nagaland",
                      "Odisha",
                      "Punjab",
                      "Rajasthan",
                      "Sikkim",
                      "Tamil Nadu",
                      "Telangana",
                      "Tripura",
                      "Uttarakhand",
                      "Uttar Pradesh",
                      "West Bengal",
                      "A & N Islands",
                      "Chandigarh",
                      "D & N Haveli",
                      "Daman & Diu",
                      "Delhi",
                      "Lakshdweep",
                      "Puducherry"
                    ]}
                    shouldItemRender={(item, value) =>
                      item.slice(0, value.length).toLowerCase() ==
                      value.toLowerCase()
                    }
                    renderItem={(item, isHighlighted) => {
                      return (
                        <div className="form-control" style={{ align: "center", fontSize: "14px", borderRadius: "0", background: "rgba(255,255,255,1)", color: "black" }}>
                          {item}
                        </div>
                      );
                    }}
                    value={this.state.val2}
                    onChange={e => this.setState({ val2: e.target.value })}
                    onSelect={val => {
                      this.setState({
                        data: val, coordinates: cities.filter(obj => {
                          return obj.name == val
                        })[0].coordinates,
                        val2: val
                      });
                    }}
                    wrapperProps={{
                      className: "no-border input-group",
                      style: { zIndex: 1 }
                    }}
                    inputProps={{
                      className: "form-control",
                      placeholder: "Select the state",
                      style: { marginBottom: "5px", borderRadius: "30px", backgroundColor: 'white' }
                    }}
                  />
                </form>
              </Col>
            </Row>
            <TileLayer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Weather state={this.state.data} />
            <Row xs={7} >
              <div
                className="chart-area"
                style={{ marginTop: "220px", marginLeft: '10px', marginBottom: '10px', width: "45%", height: "100%", zIndex: 501, position: 'relative', backgroundColor: 'rgba(255,255,255,0.6)' }}
              >
                <Greeting isLoggedIn={this.state.data} style={{ marginTop: "50px", width: "100%", height: "100%" }} />,
                          </div>
            </Row>
          </Map>
        </div>
      </div>
    );
  }
}
export default MapExample;
