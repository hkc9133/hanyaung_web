import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {Checkbox, Form, Upload, Modal, Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const Editor = dynamic(() => import("../../../component/common/Editor"), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});
import dynamic from "next/dynamic";
import {DatePicker, Space} from 'antd';

const {RangePicker} = DatePicker;

import styles from '../.././../public/assets/styles/admin/board/board.module.css';
import classnames from "classnames/bind"
import {
    addStartupCalendar,
    getStartupCalendarCategoryCodeList,
    initialize
} from "../../../store/startupCalendar/adminStartupCalendar";
import locale from "antd/lib/date-picker/locale/ko_KR";
import {UploadOutlined} from '@ant-design/icons';

const cx = classnames.bind(styles);

const Write = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [writeInfo, setWriteInfo] = useState({
        title: "",
        attachFiles: [],
        categoryCodeId: "",
        progressStatus: "OPEN"
    })
    const [content, setContent] = useState("");
    const [editor, setEditor] = useState(null);
    const [addResultModal, setAddResultModal] = useState(false)

    const {cate, add} = useSelector(({adminStartupCalendar, auth, loading}) => ({
        cate: adminStartupCalendar.cate,
        add: adminStartupCalendar.add,
    }))


    useEffect(() => {
        dispatch(getStartupCalendarCategoryCodeList())

        return () => {
            dispatch(initialize());
        };
    }, []);

    useEffect(() => {
        if (cate.length > 0) {
            setWriteInfo({...writeInfo, categoryCodeId: cate[0].categoryCodeId})
        }
    }, [cate]);

    const changeWriteInfo = useCallback((e) => {
        const {name, value} = e.target

        setWriteInfo(writeInfo => ({
            ...writeInfo,
            [name]: value,
        }))

    }, [])

    // const changeCategory = useCallback((value) =>{
    //     setWriteInfo(writeInfo =>({
    //         ...writeInfo,
    //         categoryCodeId: value,
    //     }))
    // },[])


    const changeFileList = useCallback(({fileList}) => {
        setWriteInfo(writeInfo => ({
            ...writeInfo,
            attachFiles: fileList
        }))
    }, [])

    const handlePreview = useCallback((file) => {

        const fileURL = URL.createObjectURL(file.originFileObj);
        window.open(fileURL);

    }, [])

    useEffect(() => {

        if (add.result && add.error == null) {
            Modal.success({
                title: '글쓰기 완료',
                onOk: () => {
                    router.push("/admin/startupCalendar/list")
                }
            });
        }
    }, [add])


    const submitApply = (e) => {

        // console.log("writeInfo", writeInfo);
        if (!writeInfo.eventDateStr) {
            Modal.warning({
                title: '행사일을 선택해 주세요.',
            });
            return ;
        }
        // eventDateStr
        const data = {
            ...writeInfo,
            content: editor.getData(),
            files: writeInfo.attachFiles.map((item) => (item.originFileObj)),
        }
        dispatch(addStartupCalendar(data));
    }

    const uploadButton = (
        <Button style={{marginTop: 7}} className={"upload"} icon={<UploadOutlined/>}>업로드</Button>
    );

    const changeApplyDate = (e) => {
        setWriteInfo({
            ...writeInfo,
            applyStartDateStr: e[0] != null ? e[0].format("YYYY-MM-DD HH:mm").toString() : null,
            applyEndDateStr: e[1] != null ? e[1].format("YYYY-MM-DD HH:mm").toString() : null,
        })
    }
    const changeEventDate = (e) => {
        setWriteInfo({
            ...writeInfo,
            eventDateStr: e.format("YYYY-MM-DD HH:mm").toString(),
        })
    }

    return (
        <>
            <section className={cx("container", "board_container")}>
                <h1 className={cx("top_title")}>글 쓰기</h1>
                <div className={cx("adm_container")}>
                    <div className={`${cx("member_info", "box")} clfx `}>
                        <ul className={"clfx"}>
                            <li>
                                <span className={cx("title", "icon_1")}>창업캘린더</span>
                            </li>
                        </ul>
                    </div>

                    <p className={cx("txt_style_1")}>
                        {/*회원자료 삭제 시 다른 회원이 기존 회원아이디를 사용하지 못하도록 회원아이디, 이름, 닉네임은 삭제하지 않고 영구*/}
                        {/*보관합니다.*/}
                    </p>

                    <div className={cx("admin_cont")}>
                        <Form form={form} onFinish={(e) => {
                            submitApply(e)
                        }}
                            // initialValues={{
                            //     ["title"]:view.content.title,
                            //     // ["categoryCodeId"]:view.content.categoryCodeId
                            // }}
                        >
                            <h2 className={cx("title_style_1")}><span>작성</span></h2>
                            <div className={cx("tb_style_1", "edit_form", "content")}>
                                <table>
                                    <colgroup>
                                        <col style={{width: "30%"}}/>
                                        <col/>
                                    </colgroup>
                                    <thead>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">분류</th>
                                        <td>
                                            <select name='categoryCodeId' className={cx("cate")}
                                                    onChange={changeWriteInfo} value={writeInfo.categoryCodeId}>
                                                {cate.map((item) => {
                                                    return <option key={item.categoryCodeId}
                                                                   value={item.categoryCodeId}>{item.categoryCodeName}</option>
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">진행 상태</th>
                                        <td>
                                            <select name='progressStatus' className={cx("cate")}
                                                    onChange={changeWriteInfo} value={writeInfo.progressStatus}>
                                                <option value={"OPEN"}>진행중</option>
                                                <option value={"CLOSE"}>마감</option>
                                            </select>
                                        </td>
                                    </tr>
                                    {/*<tr>*/}
                                    {/*    <th scope="row">공지</th>*/}
                                    {/*    <td>*/}
                                    {/*        <Checkbox checked={writeInfo.isNotice} onChange={(e) =>{setWriteInfo({...writeInfo,isNotice: e.target.checked})}}/>*/}
                                    {/*    </td>*/}
                                    {/*</tr>*/}
                                    <tr>
                                        <th scope="row">신청 기간</th>
                                        <td>
                                            <RangePicker
                                                placeholder={["기간 시작", "기간 종료"]} locale={locale}
                                                showTime={{format: 'HH:mm'}}
                                                format="YYYY-MM-DD HH:mm"
                                                // onChange={onChange}
                                                onOk={changeApplyDate}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">행사일</th>
                                        <td>
                                            <Form.Item
                                                name="eventDateStr"
                                                className={(cx("antd_input"))}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '날짜를 선택해주세요',
                                                    },
                                                ]}
                                            >
                                                <DatePicker locale={locale} showTime format="YYYY-MM-DD HH:mm"
                                                            onOk={changeEventDate}/>
                                            </Form.Item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">제목</th>
                                        <td>
                                            <Form.Item
                                                name="title"
                                                className={(cx("antd_input"))}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '제목은 필수 입니다.',
                                                    },
                                                ]}
                                            >
                                                <input type="text" placeholder={"제목을 입력하세요."} name="title"
                                                       value={writeInfo.title} onChange={changeWriteInfo}/>
                                            </Form.Item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">내용</th>
                                        <td>
                                            <Form.Item
                                                name="content"
                                                className={(cx("antd_input"))}
                                                // rules={[
                                                //     ({ getFieldValue }) => ({
                                                //         validator(rule, value) {
                                                //             if(content == null || content == ""){
                                                //                 return Promise.reject('내용을 입력해주세요')
                                                //             }
                                                //             return Promise.resolve()
                                                //         }
                                                //     })
                                                // ]}
                                            >
                                                <Editor setEditor={setEditor}/>
                                            </Form.Item>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">첨부파일</th>
                                        <td>
                                            <Upload
                                                listType="picture"
                                                fileList={writeInfo.attachFiles}
                                                onPreview={handlePreview}
                                                onChange={changeFileList}
                                                // previewFile={(e)=>{console.log(e)}}
                                            >
                                                {writeInfo.attachFiles.length >= 8 ? null : uploadButton}
                                            </Upload>
                                            <span className={cx("title")}>첨부파일 (10MB 미만)</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className={"txt_c"}>
                                    <button type="submit" className={cx("basic-btn02", "btn-blue-bd")}>저장</button>
                                    <button type="button" className={cx("basic-btn02", "btn-gray-bd")}
                                            onClick={router.back}>취소
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                {/*<Modal visible={addResultModal} closable={true} maskClosable={true} onClose={() => {setAddResultModal(false);router.push("/admin/startupCalendar/list");}} cx={cx} className={"add_result_popup"}>*/}
                {/*    <h1 className={cx("popup_title")}>글쓰기 완료</h1>*/}
                {/*</Modal>*/}
            </section>


            {/*<section className={cx("sub_container")}>*/}
            {/*    <Form form={form} onFinish={(e) =>{submitApply(e)}}>*/}
            {/*        <h1 className={cx("sub_top_title")}>{board.board.boardKrName}</h1>*/}
            {/*        <p className={cx("sub_top_txt")}>{board.board.boardDesc != null  ? board.board.boardDesc : ""}</p>*/}
            {/*        <div className={cx("bbs_write")}>*/}
            {/*            <table>*/}
            {/*                <colgroup>*/}
            {/*                    <col style={{width:"18%"}}/>*/}
            {/*                    <col/>*/}
            {/*                </colgroup>*/}
            {/*                <tbody>*/}
            {/*                {board.categoryCode != null && board.board.categoryId != null && (*/}
            {/*                    <tr>*/}
            {/*                        <th scope="row">분류</th>*/}
            {/*                        <td>*/}
            {/*                            <Form.Item*/}
            {/*                                name="categoryId"*/}
            {/*                                rules={[*/}
            {/*                                    {*/}
            {/*                                        required: true,*/}
            {/*                                        message: '카테고리',*/}
            {/*                                    },*/}
            {/*                                ]}*/}
            {/*                            >*/}
            {/*                                <Select size='large' className={cx("cate")} onChange={changeCategory}>*/}
            {/*                                    {board.categoryCode.map((item) => {*/}
            {/*                                        return <Option key={item.categoryCodeId} value={item.categoryCodeId}>{item.categoryCodeName}</Option>*/}
            {/*                                    })}*/}
            {/*                                </Select>*/}
            {/*                            </Form.Item>*/}
            {/*                        </td>*/}
            {/*                    </tr>*/}
            {/*                )}*/}
            {/*                <tr>*/}
            {/*                    <th scope="row">공지</th>*/}
            {/*                    <td>*/}
            {/*                        <Form.Item*/}
            {/*                        >*/}
            {/*                            <Checkbox checked={writeInfo.isNotice} onChange={(e) =>{setWriteInfo({...writeInfo,isNotice: e.target.checked})}}/>*/}
            {/*                        </Form.Item>*/}
            {/*                    </td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <th scope="row">제목</th>*/}
            {/*                    <td>*/}
            {/*                        <Form.Item*/}
            {/*                            name="title"*/}
            {/*                            rules={[*/}
            {/*                                {*/}
            {/*                                    required: true,*/}
            {/*                                    message: '제목을 입력하세요.',*/}
            {/*                                },*/}
            {/*                            ]}*/}
            {/*                        >*/}
            {/*                            <Input placeholder={"제목을 입력하세요."} name="title" value={writeInfo.title}*/}
            {/*                                   onChange={changeWriteInfo}/>*/}
            {/*                        </Form.Item>*/}
            {/*                        /!*<input type="text" placeholder="제목을 입력하세요."/>*!/*/}
            {/*                    </td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <th scope="row">내용</th>*/}
            {/*                    <td>*/}
            {/*                        <QuillEditor Contents={content} QuillChange={setContent}/>*/}
            {/*                    </td>*/}
            {/*                </tr>*/}
            {/*                {board.board.useFile && (*/}
            {/*                    <tr>*/}
            {/*                        <th scope="row">첨부파일</th>*/}
            {/*                        <td>*/}
            {/*                            <Upload*/}
            {/*                                listType="picture-card"*/}
            {/*                                fileList={writeInfo.attachFiles}*/}
            {/*                                onPreview={handlePreview}*/}
            {/*                                onChange={changeFileList}*/}
            {/*                                // previewFile={(e)=>{console.log(e)}}*/}
            {/*                            >*/}
            {/*                                {writeInfo.attachFiles.length >= 8 ? null : uploadButton}*/}
            {/*                            </Upload>*/}
            {/*                            <span className={cx("title")}>첨부파일 (10MB 미만)</span>*/}
            {/*                        </td>*/}
            {/*                    </tr>*/}
            {/*                )}*/}
            {/*                </tbody>*/}
            {/*            </table>*/}

            {/*            <div className={"txt_c"}>*/}
            {/*                <button type="submit" className={cx("basic-btn02","btn-blue-bd")}>저장</button>*/}
            {/*                <button type="button" className={cx("basic-btn02","btn-gray-bd")} onClick={router.back}>취소</button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Form>*/}
            {/*    <Modal visible={addResultModal} closable={true} maskClosable={true} onClose={() => {setAddResultModal(false);router.back();}} cx={cx} className={"add_result_popup"}>*/}
            {/*        <h1 className={cx("popup_title")}>글쓰기 완료</h1>*/}
            {/*    </Modal>*/}
            {/*</section>*/}
        </>

    );
};

export default Write;
