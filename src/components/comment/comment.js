import { formatDistanceToNow } from 'date-fns';
import { memo } from 'react';
import viLocale from 'date-fns/locale/vi';

function Comment(props) {
    return props.comments.map((comment, index) => {
        return (
            <div
                className={`flex items-center justify-between ${
                    index !== props.comments.length - 1 ? 'border-solid border-b-2 border-slate-400' : ''
                }`}
                key={index}
            >
                <div className="py-4 flex items-center">
                    <div className="py-4 flex items-center">
                        <div className="mr-3 flex-shrink-0">
                            <img
                                src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                                alt="avatar"
                                className="justify-self-start w-11 h-11 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex">
                            <div>
                                <div className="text-blue-500 mr-4">{comment.idUser.name}</div>
                            </div>
                            <span className="text-slate-400">{comment.comment}</span>
                        </div>
                    </div>
                </div>
                <div className="">
                    <span className="text-[13px]">{formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: viLocale })}</span>
                    <div className='flex items-center'>
                    <div className="text-[13px] cursor-pointer">Trả lời</div>
                    <div>
                        <span
                            onClick={() => {
                                props.deleteComment(comment._id, index);
                            }}
                            className="text-2xl cursor-pointer px-6"
                        >
                            &times;
                        </span>
                    </div>
                    </div>
                </div>
            </div>
        );
    });
}

export default memo(Comment);
