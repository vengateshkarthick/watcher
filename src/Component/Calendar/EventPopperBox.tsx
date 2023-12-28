import * as React from 'react';
import { Tooltip } from 'react-tooltip';
// import bell from '../../assests/bell.svg';
import { EventPopper } from './calendar.type';
import './calendar.scss';


function EventPopperBox({ id, place = "right", public_events }:EventPopper) {
  
    return (
      <Tooltip
        id={id}
        place={place}
        className='tootlip-box'
        clickable
        variant='dark'
        border="16"
        style={{ boxShadow: "none", backgroundColor: '#263e58' }}
      >
        <div className='event-popper-box-container p-1'>
           <div className='public-events d-flex flex-column justify-content-start align-items-start'>
            <header className='w-100'> Public holidays</header>
            <ol>
            {
               
               (public_events || []).map(({ name, type , date }, idx) => (
                <li key={`${name}-${date}-${idx}`}>
                 
                 <article className='event-details'>
                   <div className='event-name'>{name?.trimStart()}</div>
                   <div className='event-type'> - {type.join(' ')}</div>
                 </article>

                </li>
               ))
           }
            </ol>
            

           </div>

        </div>

      </Tooltip>
    );

}

export default EventPopperBox;