import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CustomizedAccordions({ domains }) {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      {domains?.map((domain, id) => {
        id++;
        return (
          <Accordion
            key={`accordin-${id}`}
            expanded={expanded === `panel${id}`}
            onChange={handleChange(`panel${id}`)}
          >
            <AccordionSummary
              aria-controls={`panel${id}d-content`}
              id={`panel${id}d-header`}
            >
              <Typography>{domain.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p style={{ fontSize: "13px" }}>
                {
                    domain.rationale  
                }
              </p>
              <div style={{display:"flex", justifyContent:"space-around"}}>
                <div className="body-left">
                  <h4>Advantages</h4>
                  {domain?.advantages?.map((adv) => (
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                      <img
                        src="https://img.icons8.com/?size=100&id=IAq2Sv2pQnkn&format=png&color=40C057"
                        alt=""
                        style={{ width: "14px", marginRight: "10px" }}
                      />
                      <p style={{ fontSize: "12px" }}>{adv}</p>
                    </div>
                  ))}
                </div>
                <div className="body-right">
                  <h4>Disadvantages</h4>
                  {domain?.disadvantages?.map((dis) => (
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                      <img
                        src="https://img.icons8.com/?size=100&id=8112&format=png&color=FA5252"
                        alt=""
                        style={{ width: "14px", marginRight: "10px" }}
                      />
                      <p style={{ fontSize: "12px" }}>{dis}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
