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
import { Select, Input, Modal, Button } from 'antd';
import '../node_modules/antd/dist/antd.css';

const Option = Select.Option;

class App extends Component {
  state = {
    data: this.props.getData(),
    loader: true,
    groups: [],
    text: '',
    modalData: null
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  loadData = () => {
    const data = this.props.getData()
    if (data.length) {
      this.setState({
        data: [...this.state.data, ...data]
      })
    } else {
      this.setState({
        loader: false
      })
    }
  }

  handleScroll = () => {
    if (window.innerHeight + window.pageYOffset > (document.body.scrollHeight - 80)) {
      this.loadData()
    }
  }

  filterData = (data) => {
    return data.filter(row => {
      const { groups, text } = this.state
      const groupInFilter = groups.length === 0 || groups.includes(row.group)
      const textInFilter = text.length === 0 || row.text.includes(text)
      return groupInFilter && textInFilter
    })
  }

  handleGroupSelect = (groups) => this.setState({groups: groups})
  handleInputChange = (e) => this.setState({text: e.target.value})
  handleCancel = () => this.setState({modalData: null})
  setModalData = (d) => this.setState({modalData: d})

  render() {
    const { modalData } = this.state
    return (
      <div className='App'>
        <table style={{width: '45%'}}>
          <thead>
            <tr>
              <td>
                Date
              </td>
              <td>
                <Select
                  style={{ width: '16rem' }}
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
                  style={{ width: "100%" }}
                  placeholder='Text'
                />
              </td>
              <td></td>
            </tr>
           </thead>

           <tfoot>
             <tr>
               <td colSpan='4'>
                  {this.state.loader &&
                    <Button size='small' onClick={this.loadData}>Load more...</Button>
                  }
               </td>
             </tr>
           </tfoot>

           <tbody border={1}>
            {this.filterData(this.state.data).map(d => {
              return (
                <tr key={d.text + d.date}>
                  <td>{d.date}</td>
                  <td>{d.group}</td>
                  <td className='textCell'>{d.text}</td>
                  <td
                    onClick={() => this.setModalData(d)}
                    className='showColumn'
                  >
                    show
                  </td>
                </tr>
              )
            })}
           </tbody>

           <Modal
             visible={!!modalData}
             onCancel={this.handleCancel}
             footer={null}
           >
             <p>{modalData && <span><div className='modalTitle'>Date: </div>  {modalData.date}</span>}</p>
             <p>{modalData && <span><div className='modalTitle'>Group:</div> {modalData.group}</span>}</p>
             <p>{modalData && <span><div className='modalTitle'>Text: </div>  {modalData.text}</span>}</p>
           </Modal>
        </table>
      </div>
    );
  }
}

/*

*/

export default App;
