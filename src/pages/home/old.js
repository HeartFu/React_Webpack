import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { autobind } from 'core-decorators'
import { Select, Table, Upload, Button, message, Modal, Spin, Icon } from 'antd'
import { explorerError } from '@/assets/js/common.js'
import logoImg from '@/assets/image/home/logo.png'
import './index.scss'

@connect(state => ({
    apis: state.apis
}))
export default class Home extends Component {
    constructor() {
        super()
        this.state = {
            activeInx: '1',
            modal2Visible: false,
            inputVal: '',
            isEmpty: false,
            isCorrect: false,
            isError: false,
            blockInfo: null, // 区块信息
            dataSource: [], // 最新区块信息表格列表
            dataSouece1: [], // 查询出现弹窗表格
            loading: true, // 获取区块信息的loading
            loading1: true, // 获取表格信息的loading
            loading3: false, // 按钮上的loading
            loading4: false, // 文件上传验证按钮的loading
            fileList: [],
            optionList: [], // 获取医院列表信息
            optionVal: '', // 医院选择框的值
            chainTime: '', // 验证信息成功的返回的上链时间
            fileId: '', // 文件的id
            medicalId: '', // 病历号ID
            dataCount: '', // 查询信息的总数
            isHTML: '',
            disabled: false
        }
    }
    componentDidMount() {
        this.blockInfoTime = setInterval(() => this.blockInfo(), 10000)
        this.blockListTime = setInterval(() => this.blockList(), 10000)
        this.blockInfo()
        this.blockList()
        this.getOptionList()
        explorerError()
    }
    componentWillUnmount() {
        clearInterval(this.blockInfoTime)
        clearInterval(this.blockListTime)
    }
    // 上传文件
    @autobind
    onChange(info) {
        if (info.fileList.length === 0) {
            this.setState({
                isError: false,
                isCorrect: false
            })
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 0) { // 上传成功
                this.state.fileId = info.file.response.data.id
                this.state.isHTML = ''
                this.state.disabled = false
                this.setState({})
                message.success(`${info.file.name} 文件上传成功`)
            } else {
                message.error(info.file.response.msg)
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`)
        }
    }
    // 点击移除文件时的回调
    @autobind
    onRemove(file) {
        this.setState(({ fileList }) => {
            const index = fileList.indexOf(file)
            const newFileList = fileList.slice()
            newFileList.splice(index, 1)
            return {
                fileList: newFileList,
            }
        })
    }
    // 点击继续验证出现弹窗（根据病历号查询
    @autobind
    async setModal2Visible(modal2Visible) {
        if (this.state.inputVal === '') {
            this.setState({ isEmpty: true })
        } else if (this.state.optionVal === '') {
            message.error('请选择医院')
        } else {
            this.setState({ loading3: true })
            try {
                const res = await this.props.apis.medicalCodeList({
                    medicalRecord: this.state.inputVal, // 医院病历号
                    medicalCode: this.state.optionVal // 医院编码
                })
                if (res.code === 0) {
                    if (res.count === 0) { // 查询到0条信息
                        this.setState({
                            isError: true,
                            modal2Visible: false,
                            loading3: false
                        })
                    } else {
                        this.setState({
                            dataSouece1: res.data,
                            dataCount: res.count,
                            modal2Visible,
                            loading3: false
                        })
                    }
                } else {
                    message.error(res.msg)
                }
            } catch (e) {
                message.error(e.msg)
            }
        }
    }
    // 获取医院信息列表
    @autobind
    async getOptionList() {
        try {
            const res = await this.props.apis.medicalList({})
            if (res.code === 0) {
                this.setState({
                    optionList: res.data,
                })
            } else {
                message.error(res.msg)
            }
        } catch (e) {
            message.error(e.msg)
        }
    }
    // 获取最新数据表格
    @autobind
    async blockList() {
        try {
            const res = await this.props.apis.blockList({})
            if (res.code === 0) {
                const arr = res.data
                for (let i = 0; i < arr.length; i += 1) {
                    res.data[i].key = res.data[i].blockHash
                }
                this.setState({
                    dataSource: res.data,
                    loading1: false
                })
            }
        } catch (e) {
            message.error(e.msg)
        }
    }
    // 区块基本数据查询
    @autobind
    async blockInfo() {
        try {
            const res = await this.props.apis.blockInfo({})
            if (res.code === 0) {
                this.setState({
                    blockInfo: res.data,
                    loading: false
                })
            }
        } catch (e) {
            message.error(e.msg)
        }
    }
    // 取消弹窗
    @autobind
    handleCancel() {
        this.setState({ modal2Visible: false })
    }
    // 前往验证按钮
    @autobind
    handleCheck(id, item) {
        if (item === '1') { // 代表文件上传验证
            if (this.state.fileList.length === 0) {
                message.error('请上传文件')
            } else if (this.state.fileList.length !== 0 && this.state.isHTML !== 'notHtml') {
                this.setState({
                    fileId: id,
                    loading4: true
                })
                this.check(id)
            }
        } else if (item === '2') { // 代表弹窗里的表格验证
            this.setState({
                medicalId: id
            })
            this.checkMedical(id)
        }
    }
    // 验证病历号查询
    @autobind
    async checkMedical(id) {
        this.setState({ modal2Visible: false })
        try {
            const res = await this.props.apis.checkMedical({
                id
            })
            if (res.code === 0) {
                this.setState({
                    isCorrect: true,
                    chainTime: res.data.chainTime,
                    disabled: false,
                    loading4: false
                })
            } else {
                this.setState({
                    isError: true,
                    loading4: false
                })
            }
        } catch (e) {
            message.error(e.msg)
        }
    }
    // 验证文件函数
    @autobind
    async check(id) {
        this.setState({ modal2Visible: false })
        try {
            const res = await this.props.apis.checkFile({
                id
            })
            if (res.code === 0) {
                this.setState({
                    isCorrect: true,
                    chainTime: res.data.chainTime,
                    disabled: false,
                    loading4: false
                })
            } else {
                this.setState({
                    isError: true,
                    loading4: false
                })
            }
        } catch (e) {
            message.error(e.msg)
        }
    }
    // 获取医院选择框的值
    @autobind
    handleChange(value) {
        this.state.optionVal = value
        this.setState({})
    }
    @autobind
    beforeUpload(file) {
        const isHTML = file.type === 'text/html'
        if (!isHTML) {
            message.error('只能上传html文件!')
            this.setState({
                isHTML: 'notHtml',
                disabled: true
            })
        }
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
            message.error('文件必须小于 5MB!')
            this.setState({
                isHTML: 'notHtml',
                disabled: true
            })
        }
        if (isHTML && isLt5M) {
            this.setState({ isHTML: '' })
        }
        this.setState(({ fileList }) => ({
            fileList: [...fileList, file],
        }))
        return isHTML && isLt5M
    }
    // 获取输入框的值
    @autobind
    handleInputVal(e) {
        this.state.inputVal = e.target.value
        this.setState({})
        if (e.target.value !== '') {
            this.setState({
                isEmpty: false,
                isCorrect: false,
                isError: false
            })
        }
    }
    // tab切换
    @autobind
    handleTabChange(e) {
        this.setState({
            activeInx: e,
            isEmpty: false,
            isCorrect: false,
            isError: false,
        })
    }
    // 跳转到详情页
    @autobind
    handleDetail() {
        if (this.state.activeInx === '1') { // 表示当前是病例号验证
            this.props.history.push(`/detail?id=${this.state.medicalId}&type=medical`)
        } else if (this.state.activeInx === '2') { // 表示当前是文件验证
            this.props.history.push(`/detail?id=${this.state.fileId}&type=file`)
        }
    }
    render() {
        const { Option } = Select
        const columns = [{
            title: '数据hash',
            dataIndex: 'blockHash',
            key: 'blockHash',
        }, {
            title: '所属医院',
            dataIndex: 'medicalName',
            key: 'medicalName',
        }, {
            title: '上链时间',
            dataIndex: 'chainTime',
            key: 'chainTime',
            render: chainTime => (moment(Number(chainTime)).format('YYYY-MM-DD HH:mm:ss'))
        }]
        const props = {
            name: 'file',
            action: 'api/blockChain/validate/upload',
            headers: {
                authorization: 'authorization-text',
            },
        }
        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
        return (
            <div className="home">
                <div className="home-top">
                    <div className="home-wrap">
                        <div className="home-header">
                            <Link to="/home"><img alt="" src={logoImg} /></Link>
                            <span className="home-header-name">所属医院</span>
                            <div style={{ position: 'relative' }}>
                                <Select
                                    placeholder="请选择医院"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    showArrow={false}
                                    onChange={this.handleChange}
                                >
                                    {
                                        this.state.optionList.map((item, index) => (
                                            <Option key={index} value={item.medicalCode}>{item.medicalName}</Option>
                                        ))
                                    }
                                </Select>
                                <div className="selectSanjiao" />
                            </div>
                        </div>
                        <div className="home-center">
                            {/* <p>医疗数据民主化</p> */}
                            <i className="iconfont icon-yiliaoshujuminzhuhua" />
                            <div>知情同意书数据查询验证</div>
                        </div>
                        <div className="home-bottom">
                            <div>
                                <span onClick={() => { this.handleTabChange('1') }} className={this.state.activeInx === '1' ? 'active tabchange' : 'tabchange'}>病例号验证</span>
                                <span onClick={() => { this.handleTabChange('2') }} className={this.state.activeInx === '2' ? 'active tabchange' : 'tabchange'}>文件验证</span>
                            </div>
                            <div className="home-input">
                                <div className={this.state.activeInx === '2' ? 'sanjiao sanjiaoActive' : 'sanjiao'} />
                                {
                                    this.state.activeInx !== '2' ?
                                        <div className="input-wrap">
                                            <input type="text" placeholder="请输入病历号" onChange={this.handleInputVal} value={this.state.inputVal} />
                                            <Spin spinning={this.state.loading3} indicator={antIcon}>
                                                <button className="btn" onClick={() => { this.setModal2Visible(true) }}>继续验证</button>
                                            </Spin>
                                        </div>
                                        :
                                        <div className="inputfile-wrap">
                                            <Upload {...props} onChange={this.onChange} beforeUpload={this.beforeUpload} onRemove={this.onRemove}>
                                                <Button disabled={this.state.fileList.length === 1}>
                                                    {this.state.fileList.length === 0 ? '点击上传文件' : ''}
                                                </Button>
                                            </Upload>
                                            <Spin spinning={this.state.loading4} indicator={antIcon}>
                                                <button className="btn" disabled={this.state.disabled} onClick={() => { this.handleCheck(this.state.fileId, '1') }}>继续验证</button>
                                            </Spin>
                                        </div>
                                }
                                <Modal
                                    wrapClassName="vertical-center-modal"
                                    visible={this.state.modal2Visible}
                                    onCancel={this.handleCancel}
                                    footer={null}
                                >
                                    <p className="modal-title">为您查询到<span>{this.state.dataCount}</span>条信息</p>
                                    <div className="table-wrap">
                                        <div className="table-title">
                                            <span>所属医院</span>
                                            <span>上链时间</span>
                                            <span>操作</span>
                                        </div>
                                        <ul>
                                            {
                                                this.state.dataSouece1.map((item, index) => (
                                                    <li key={index}>
                                                        <div>{item.medicalName}</div>
                                                        <div>{moment(Number(item.chainTime)).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                        <div onClick={() => { this.handleCheck(item.id, '2') }}>前去验证</div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </Modal>
                            </div>
                            <div className="correctMsg">
                                {this.state.isEmpty ? <div><i className="iconfont icon-cuowu" />请输入区块号</div> : null}
                                {this.state.isCorrect ? <div><i className="iconfont icon-zhengque" />验证成功，匹配到在链上完全一致的文件信息，数据上链时间为&nbsp;&nbsp;{moment(Number(this.state.chainTime)).format('YYYY-MM-DD HH:mm:ss')}<span onClick={this.handleDetail}>查看详情</span></div> : null}
                                {this.state.isError ? <div><i className="iconfont icon-cuowu" />验证失败，无法查询到与该文件完全匹配的信息</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-block">
                    <Spin spinning={this.state.loading} indicator={antIcon}>
                        {
                            this.state.blockInfo ?
                                <div className="home-block-wrap">
                                    <div className="home-block-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="75" height="66">
                                            <use xlinkHref="#icon-browser" width="75" />
                                        </svg>
                                        <div className="home-block-num">
                                            <p>{this.state.blockInfo.userCount}</p>
                                            <div>用户数量</div>
                                        </div>
                                    </div>
                                    <div className="home-block-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="75" height="66">
                                            <use xlinkHref="#icon-bar-chartcopy" width="75" />
                                        </svg>
                                        <div className="home-block-num">
                                            <p>{this.state.blockInfo.blockHigh}</p>
                                            <div>区块高度</div>
                                        </div>
                                    </div>
                                    <div className="home-block-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="75" height="66">
                                            <use xlinkHref="#icon-browsers-" width="75" />
                                        </svg>
                                        <div className="home-block-num">
                                            <p>{this.state.blockInfo.dateCount}</p>
                                            <div>数据总量</div>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                    </Spin>
                </div>
                <div className="home-table">
                    <div className="home-table-name">
                        最新数据
                    </div>
                    <Spin spinning={this.state.loading1} indicator={antIcon} style={{ margin: '0 auto' }}>
                        <Table dataSource={this.state.dataSource} columns={columns} pagination={false} />
                    </Spin>
                    <p>杭州医元科技有限公司提供技术支持</p>
                </div>
            </div>
        )
    }
}
