import React, { Component } from 'react'
import './index.scss'

export default class Home extends Component {
    constructor() {
        super()
        this.state = {
            test: '111',
        }
    }
    render() {
        return (
            <div className="home">
                <div>{this.state.test}</div>
            </div>
        )
    }
}
