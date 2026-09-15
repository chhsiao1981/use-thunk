import { getDefaultID, getMod, useThunk } from "../src";
import * as ModChild3 from "./child3";

export type Props = {
  myID: string;
};

export default (props: Props) => {
  const { myID } = props;

  const [child3, doChild3] = useThunk<ModChild3.State, typeof ModChild3>(
    ModChild3,
    myID,
  );
  const moduleChild3 = getMod<ModChild3.State>(ModChild3.name);

  const { count } = child3;

  const defaultID = getDefaultID(moduleChild3);

  const onClick = () => {
    doChild3.increment(myID);
  };

  const onClick2 = () => {
    doChild3.increment2(myID);
  };

  const onClick3 = () => {
    doChild3.increment3(myID);
  };

  return (
    <>
      <div className="child-my-id">{myID}</div>
      <div className="child-default-id">
        {myID}: {defaultID}
      </div>
      <div className="child-count" key={`count-${myID}`}>
        {myID}: {count}
      </div>
      <button className="child-button" type="button" onClick={onClick}>
        {myID}: click me
      </button>
      <button className="child-button-2" type="button" onClick={onClick2}>
        {myID}: click me 2
      </button>
      <button className="child-button-3" type="button" onClick={onClick3}>
        {myID}: click me 3
      </button>
    </>
  );
};
