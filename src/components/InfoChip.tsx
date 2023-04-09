import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

const InfoChip = styled(Chip)(({ theme }) => ({
    height: "auto",
    "& .MuiChip-label": {
        padding: "4px 8px",
    },
}));
export default InfoChip;
