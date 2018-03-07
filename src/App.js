/*
Proszę o wizualizację danych w formie tabeli z funkcją sortowania i filtrowania.

Dane do wizualizacji: 50 000 wierszy, 4 kolumny:

Date: data w formacie: RRRR-MM-DD
Group: lista wartości: a, b, c, d, e.  Filtr w nagłówku tabeli w postaci listy wielokrotnego wyboru (multiselect).
Text: ciąg znaków, max. długość 50 znaków. Filtrowanie wyników według wpisanego przez użytkownika fragmentu tekstu.
kolumna z  linkiem „show” po kliknięciu którego wyświetla się modalne okno z wartościami trzech pierwszych kolumn jedna pod drugą (Date, Group, Text) z danego wiersza.

W tabeli wyświetlane jest pierwsze 100 wierszy, kolejne dobierane są podczas scrolowania (infinite-scroll).
*/

import React, { Component } from 'react'
import './App.css';
import { Select, Input, Modal } from 'antd';
import '../node_modules/antd/dist/antd.css';
const Option = Select.Option;

const rand = (range) => {
  return Math.round(Math.random()*(range-1)) + 1
}
const letters = 'abc def ghi jkl mno pqr stu vwx yz'
const dataPoints = 50000
const loadNr = 100
const maxTimesLoaded = dataPoints / loadNr
let timesLoaded = 0

const getData = () => {
  const randomData = () => {
    let data = []
    for (let i=1; i<=100; i++) {
      data.push({
        date: `${1990 + rand(30)}-${String(rand(12)).padStart(2, 0)}-${String(rand(28)).padStart(2, 0)}`,
        group: ['a', 'b', 'c', 'd', 'e'][rand(5)-1],
        text: letters.split('').filter(() => rand(2)-1).join('')
      })
    }
    timesLoaded++
    return timesLoaded >= maxTimesLoaded ? [] : data
  }

  return randomData()
}

class App extends Component {
  state = {
    data: getData(),
    loader: true,
    groups: [],
    text: '',
    modalData: null
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.innerHeight + window.pageYOffset > (document.body.scrollHeight - 70)) {
      const data = getData()
      if (data.length) {
        this.setState({
          data: [...this.state.data, ...getData()]
        })
      } else {
        this.setState({
          loader: false
        })
      }
    }
  }

  filterData = (data) => {
    return data.filter(row => {
      return (this.state.groups.length === 0 || this.state.groups.includes(row.group)) && (this.state.text.length === 0 || row.text.includes(this.state.text))
    })
  }

  handleGroupSelect = (groups) => {
    console.log('groups', groups);
    this.setState({
      groups: groups
    })
  }

  handleInputChange = (e) => {
    this.setState({
      text: e.target.value
    })
  }

  handleCancel = () => {
    this.setState({
      modalData: null
    })
  }

  setModalData = (d) => {
    this.setState({
      modalData: d
    })
  }

  render() {
    const { modalData } = this.state
    return (
      <div className='App'>
        <table border={1} style={{width: '60%'}}>
          <thead>
            <tr>
              <td>
                Date
              </td>
              <td>
                <Select
                  style={{ width: "17rem" }}
                  allowClear
                  mode="multiple"
                  placeholder='Group'
                  onChange={this.handleGroupSelect}
                  value={this.state.groups}
                >
                  {['a','b','c','d', 'e'].map(val => {
                    return <Option key={val} value={val}>{val}</Option>
                  })}
                </Select>
              </td>
              <td>
                <Input
                  onChange={this.handleInputChange}
                  style={{ width: "17rem" }}
                  placeholder='Text'
                />
              </td>
              <td></td>
            </tr>
           </thead>

           {this.state.loader &&
             <tfoot>
              <tr>
                 <td colSpan='4'>
                  Loading...
                 </td>
              </tr>
             </tfoot>
           }

           <tbody>
            {this.filterData(this.state.data).map(d => {
              return (
                <tr key={d.text + d.date}>
                  <td>{d.date}</td>
                  <td>{d.group}</td>
                  <td>{d.text}</td>
                  <td onClick={() => this.setModalData(d)}>show</td>
                </tr>
              )
            })}
            <Modal
              visible={!!modalData}
              onCancel={this.handleCancel}
              footer={null}
            >
              <p>{modalData && modalData.date}</p>
              <p>{modalData && modalData.group}</p>
              <p>{modalData && modalData.text}</p>
            </Modal>
           </tbody>
        </table>
      </div>
    );
  }
}

/*

*/

export default App;
