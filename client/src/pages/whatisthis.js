import { useNavigate } from 'react-router-dom';

const WhatIsThis = () => {
    //const navigate = useNavigate();
    return (
        <div style={{padding:10}}>
            <h2 className="text-xl font-bold mb-4" >What is this?</h2>
            <p className="mb-4" style={{color:'red'}}>tbd.</p>
            {/* <button onClick={() => navigate('/')}> Go Back Home </button> */}
        </div>
    );
  };

  export default WhatIsThis;
