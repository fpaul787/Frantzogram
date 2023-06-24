import React, { useState } from 'react';
import { MoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import {
    LikeFilled,
    CommentOutlined,
    LikeOutlined,
} from "@ant-design/icons";
import { Image, Card, Dropdown, Form, Button, Modal } from "react-bootstrap";
import Toaster from '../Toaster';
import { randomAvatar } from '../../utils';
import axoisService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';

const MoreToggleIcon = React.forwardRef(({ onClick }, ref) => (
    <Link
        to="#"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        <MoreOutlined />
    </Link>
))
export default function Post(props) {
    const [showToast, setShowToast] = useState(false);
    const user = getUser();
    const { post, refresh } = props;

    const handleDelete = () => {
        axoisService
            .delete(`api/post/${post.id}`)
            .then(() => {
                setShowToast(true);
                refresh();
            })
            .catch((err) => console.error(err));
    }

    const handleLikeClick = (action) => {
        axoisService
            .post(`api/post/${post.id}/${action}`)
            .then(() => {
                refresh();
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <Card className="rounded-3 my-4">
                {/* Add card body here */}
                <Card.Body>
                    <Card.Title className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-row">
                            <Image
                                src={randomAvatar()}
                                roundedCircle
                                width={48}
                                height={48}
                                className="me-2 border border-primary border-2"
                            >
                            </Image>
                            <div className="d-flex flex-column 
                                justify-content-start 
                                align-self-center 
                                mt-2">
                                <p className="fs-6 m-0">
                                    {post.author.name}
                                </p>
                                <p className="fs-6 fw-lighter">
                                    <small>{format(post.created)}</small>
                                </p>
                            </div>
                        </div>
                        {user.name === post.author.name && (
                            <div>
                                <Dropdown>
                                    <Dropdown.Toggle as={MoreToggleIcon}></Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Update</Dropdown.Item>
                                        <Dropdown.Item onClick={handleDelete} className='text-danger'>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        )}
                    </Card.Title>
                    <Card.Text>{post.body}</Card.Text>
                    <div className="d-flex flex-row">
                        <LikeFilled
                            style={{
                                color: "#fff",
                                backgroundColor: "#0D6EFD",
                                borderRadius: "50%",
                                width: "18px",
                                height: "18px",
                                fontSize: "75%",
                                padding: "2px",
                                margin: "3px",
                            }}
                        >
                        </LikeFilled>
                        <p className="ms-2 fs-6">
                            <small>{post.likes_count} like</small>
                        </p>
                    </div>
                </Card.Body>
                {/* Card Footer */}
                <Card.Footer className='d-flex bg-white w-50 justify-content-between border-0'>
                    <div className="d-flex flex-row">
                        <LikeOutlined
                            style={{
                                width: "24px",
                                height: "24px",
                                padding: "2px",
                                fontSize: "20px",
                                color: post.liked ? "#0D6EFD" : "#C4C4C4",
                            }}
                            onClick={() => {
                                if (post.liked) {
                                    handleLikeClick("remove_like");
                                } else {
                                    handleLikeClick("like");
                                }
                            }}
                        >
                        </LikeOutlined>
                        <p className='ms-2'>
                            <small>Like</small>
                        </p>
                    </div>
                {/* Add comment icon here*/}
                    <div className="d-flex flex-row">
                        <CommentOutlined
                            style={{
                                width: "24px",
                                height: "24px",
                                padding: "2px",
                                fontSize: "20px",
                                color: "#C4C4C4",
                            }}
                        >
                        </CommentOutlined>
                        <p className="ms-1 mb-0">
                            <small>Comment</small>
                        </p>
                    </div>
                </Card.Footer>
            </Card>
            <Toaster
                title="Post!"
                message="Post deleted"
                type="danger"
                showToast={showToast}
                onClose={() => setShowToast(false)}
            >
            </Toaster>
        </>
    )
}
