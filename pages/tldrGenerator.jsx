import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Button, Input } from 'reactstrap';

export default function SSRPage({ user }) {
  const [state, setState] = useState({ isLoading: false, response: undefined, error: undefined });
  const [meetingText, setMeetingText] = useState('');
  const [TLDR, setTLDR] = useState(null);

  const callApi = async (meetingText) => {
    console.log(meetingText)
    setState(previous => ({ ...previous, isLoading: true }))

    try {
      const response = await fetch('/api/generateTLDR', {
        method: 'POST',
        body:JSON.stringify({meetingText: meetingText}),
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json', 
        }
      });
      const data = await response.json();

      setTLDR(data.message);
      // setState(previous => ({ ...previous, response: data, error: undefined }))
    } catch (error) {
      // setState(previous => ({ ...previous, response: undefined, error }))
    } finally {
      // setState(previous => ({ ...previous, isLoading: false }))
    }
  };

  const handle = (event) => {
    event.preventDefault();
    callApi(meetingText);
  };

  const { isLoading, response, error } = state;

  return (
    <>
      <div className="mb-5" data-testid="ssr">
        <h1 data-testid="ssr-title">Meeting TLDR;</h1>
        <div data-testid="ssr-text">
          <p>
            Paste the meeting text here </p> <Input type="textarea" bsSize = "lg" value={meetingText} onChange={(e)=> setMeetingText(e.target.value)} />
          <Button color="primary" className="mt-5" onClick={e => handle(e)} data-testid="external-action">
            Generate TLDR
        </Button>
        </div>
        <div>
          <br></br>
        {TLDR &&
        <div>
          <h2>TLDR;</h2>
          <p>{TLDR}</p>
        </div>
        }
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
