import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

function StarSort() {
  return (
    <div className=" font-bold sticky top-20">
      <div>Đánh giá sao</div>
      <div className="md:pr-10">
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="5 sao" />
          <FormControlLabel control={<Checkbox />} label="4 sao" />
          <FormControlLabel control={<Checkbox />} label="3 sao" />
          <FormControlLabel control={<Checkbox />} label="2 sao" />
          <FormControlLabel control={<Checkbox />} label="1 sao" />
        </FormGroup>
      </div>
    </div>
  );
}

export default StarSort;
