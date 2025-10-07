import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

type Props = {
  selectedStar: number | null;
  onChange: (star: number | null) => void;
};

function StarSort({ selectedStar, onChange }: Props) {
  return (
    <div className="font-bold sticky top-20">
      <div>Đánh giá sao</div>
      <div className="md:pr-10">
        <FormControl component="fieldset">
          <RadioGroup value={selectedStar !== null ? String(selectedStar) : ""}>
            {[5, 4, 3, 2, 1].map((star) => (
              <FormControlLabel
                key={star}
                value={String(star)}
                control={<Radio />}
                label={`${star} sao`}
                onClick={() => {
                  if (selectedStar === star) {
                    onChange(null);
                  } else {
                    onChange(star);
                  }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}

export default StarSort;
