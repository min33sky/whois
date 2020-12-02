import React from 'react';
import styled from 'styled-components';

const Loading = styled.div.attrs(props => ({
  className: props.className,
}))`
  background: url('https://media.giphy.com/media/PUYgk3wpNk0WA/giphy.gif') no-repeat center / 200px;

  &.loading-box-m {
    width: 500px;
    height: 500px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.loading-box-s {
    width: 100%;
    height: 100%;
    position: static;
  }
`;

function Loader({ size = 'm' }) {
  return <Loading className={`loading-box-${size}`} />;
}

export default Loader;
