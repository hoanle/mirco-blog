import React from "react";

export default ({ comments }) => {
  const renderedComments = Object.values(comments).map((comment) => {
    return (
      <li key={comment.id}>
        {comment.content} ({comment.status})
      </li>
    );
  });
  return (
    <div className="d-flex flex-column flex-wrap justify-content-between">
      {renderedComments}
    </div>
  );
};
