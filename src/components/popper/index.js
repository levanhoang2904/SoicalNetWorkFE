import axios from 'axios';
import styles from './popper.module.scss';
import classNames from 'classnames/bind';
import React, { memo } from 'react';
import { config } from '../../state/Constants';
const cx = classNames.bind(styles);

function Popper(props) {
  
    return (
        <ul className={cx('list-noti')}>
            {props.data.map((data, index) => {
                return (
                    <li className={cx('noti-item')} key={index} onClick={() => props.onHandleRead(data)}>
                        <img
                            alt="noti"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/800px-Facebook_Logo_%282019%29.png"
                        />
                        <div className={cx('noti-text')}>
                            <div className={cx('noti-header')}>
                                <span>
                                    {data.idAction &&
                                        data.idAction[data.idAction.length - 1].name +
                                            (data.idAction.length > 1
                                                ? ' và ' + (data.idAction.length - 1) + ' người khác'
                                                : '') +
                                            (data.categoryNotifi === 'comment'
                                                ? ' đã bình luận về bài viết của bạn'
                                                : ' đã bày tỏ cảm xúc về bài viết của bạn')}
                                </span>
                                {!data.isRead ? <div className={cx('noti-dot')}></div> : ''}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default memo(Popper);
