import React, {useEffect} from 'react';
import Link from 'next/link'
import styles from '../../public/assets/styles/startup_info/startup_info.module.css';
import classnames from "classnames/bind"
import Image from "next/image";
import CounselApplyListTable from "../../component/stratup_counsel/counsel_apply_list/CounselApplyListTable";
import {useDispatch, useSelector} from "react-redux";
import {getCounselApplyList} from "../../store/mentoring/mentoring";
import {useRouter} from "next/router";
import {getBoardContentList} from "../../store/board/board";
import Pagination from "../../component/common/Pagination";
import Head from "next/head";

const cx = classnames.bind(styles);
const CounselApplyList = () => {

    const dispatch = useDispatch();
    const router = useRouter();


    const {user,counselApplyList} = useSelector(({auth,mentoring, loading}) => ({
        user: auth.user,
        counselApplyList:mentoring.counselApplyList,
    }))

    useEffect(() =>{

    },[])
    useEffect(() => {
        const { page = 1} = router.query
        const data = {
            page:page,
        }
        dispatch(getCounselApplyList(data))

    },[router.query])

    const pageChange = (pageNum) => {
        const queryString = qs.stringify({...router.query,page:pageNum});
        router.push(`${router.pathname}?${queryString}`)
    }

    return (
        <>
            <Head>
                <title>한양대학교 창업지원단 -멘토단 소개</title>
            </Head>
            <section className={cx("container")}>
                <div className={cx("sub_container","mentor_groupList")}>
                    <h1 className={cx("sub_top_title")}>멘토단 소개</h1>
                    <p className={cx("sub_top_txt")}>전문 멘토로부터 듣는 창업 알짜 정보 예비창업자를 위한 <br/>창업 전문 상담코너입니다.</p>

                    <div className={cx("tab_style_2")}>
                        <ul>
                            <li><Link href="/startup_counsel/counsel_apply"><a>창업상담하기</a></Link></li>
                            <li  className={cx("on")}><Link href="/startup_counsel/counsel_apply_list"><a>창업신청현황</a></Link></li>
                        </ul>
                    </div>

                    <h2>나의 멘토링 현황</h2>
                    <ul className={cx("current_situation")}>
                        <li>
                            <span className={cx("title")}>신청건수</span>
                            <span><strong>{counselApplyList.page != null && counselApplyList.page.totalCount}</strong>건</span>
                        </li>
                        <li>
                            <span className={cx("title")}>진행건수</span>
                            <span><strong>5</strong>건</span>
                        </li>
                        <li>
                            <span className={cx("title")}>완료건수</span>
                            <span><strong>5</strong>건</span>
                        </li>
                    </ul>
                    <div className={cx("th_title")}>
                        <ul>
                            <li className={cx("w_1")}>NO</li>
                            <li className={cx("w_2")}>신청일</li>
                            <li className={cx("w_3")}>희망멘토링 분야</li>
                            <li className={cx("w_4")}>상담진행 상태</li>
                            <li className={cx("w_5")}>담당멘토</li>
                        </ul>
                    </div>
                    <div className={cx("td_content")}>
                        <ul>
                            <CounselApplyListTable list={counselApplyList.list} cx={cx}/>
                        </ul>
                    </div>
                    {counselApplyList.page != null && (
                        <Pagination
                            totalRecords={counselApplyList.page.totalCount}
                            pageLimit={counselApplyList.page.pageSize}
                            pageNeighbours={1}
                            currentPage={counselApplyList.page.pageNo}
                            onPageChanged={pageChange}
                        />
                    )}
                </div>
            </section>
        </>
    );
};

export default CounselApplyList;
