import React from 'react';

// Localization
import { injectIntl, IntlShape } from 'react-intl';

// Styles
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

// Material UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownWardIcon from '@material-ui/icons/ArrowDownward';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import AddBoxIcon from '@material-ui/icons/AddBox';

// Components
import { EditFieldEnum } from 'components/contract/form/edit-area';
import SectionComponent from 'components/contract/form/section';

// Model
import { Section } from 'model/contract';

// Styles
const styles = (theme: Theme) => createStyles({
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: 0,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minHeight: '70vh',
    width: '34.2vw',
  },
  title: {
    padding: '10px',
    background: '#d3d3d369',
    border: '1px dashed #6C6C6C',
    marginBottom: '8px'
  },
  controls: {
    height: '20px',
    marginTop: '50px',
  },
  middleControls: {
    height: '20px',
    margin: 'auto',
  },
  contract: {
    maxWidth: '80%',
  },
  btn: {
  }
});

interface PageComponentProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  documentTitle: string;
  documentSubtitle?: string;
  sectionList: Section[];
  deleteSubtitle: () => void;
  removeSection: (item: any) => void;
  editSection: (...item: any) => void;
  openEdit: (editField: EditFieldEnum, section?: Section) => void;
  editTitle: (item: any) => void;
  moveSectionUp: (item: any) => void;
  moveSectionDown: (item: any) => void;
  addMiddleSection: (...item: any) => void;
}

interface PageComponentState {
}

class PageComponent extends React.Component<PageComponentProps, PageComponentState> {


  deleteSection(id: number): void {
    this.setState({
      //sections: this.props.sections - 1,
      //sectionList : Section[];
    });
  }

  render() {
    const { classes } = this.props;
    let subtitle;
    if (this.props.documentSubtitle) {
      subtitle = <div className={classes.title} >
        {this.props.documentSubtitle}
        <IconButton style={{ width: 20, height: 20, float: "right" }}
          onClick={() =>
            this.props.deleteSubtitle()
          }
        >
          <DeleteIcon />
        </IconButton>
        <IconButton className="controls" style={{ width: 20, height: 20, float: "right" }}
          onClick={() =>
            this.props.openEdit(EditFieldEnum.Subtitle)
          }
        >
          <EditIcon />
        </IconButton>
      </div>
    }


    const sections = this.props.sectionList.map((section, i) =>
      <Grid style={{ paddingLeft: section.indent, marginTop: '30px' }} key={section.id} container item xs={12} >
        <Grid className={classes.contract} container item xs={10} key={`section-${section.id}`}>
          <SectionComponent {...section} editSection={this.props.editSection.bind(this)} />
          {i < this.props.sectionList.length - 1 &&
            <div className={classes.middleControls}>
              <Tooltip title="Add normal section">
                <IconButton
                  onClick={() =>
                    this.props.addMiddleSection(section.index, section.indent, false)
                  }
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add variable section">
                <IconButton
                  onClick={() =>
                    this.props.addMiddleSection(section.index, section.indent, true)
                  }
                >
                  <AddBoxIcon />
                </IconButton>
              </Tooltip>
            </div>
          }
        </Grid>
        <div className={classes.controls}>
          <IconButton
            onClick={() =>
              this.props.moveSectionUp(section)
            }
          >
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton className={classes.btn}
            onClick={() =>
              this.props.removeSection(section.id)
            }
          >
            <DeleteIcon />
          </IconButton>
          <div>

            <IconButton className={classes.btn}
              onClick={() =>
                this.props.moveSectionDown(section)
              }
            >
              <ArrowDownWardIcon />
            </IconButton>
            <IconButton className={classes.btn}
              onClick={() =>
                this.props.openEdit(EditFieldEnum.Section, section)
              }
            >
              <EditIcon />
            </IconButton>
          </div>
        </div>

      </Grid>

    )

    return (
      <div>
        <Grid container item xs={12}>
          <Paper className={classes.paper} style={{ overflow: 'hidden' }}>
            <div className={classes.title}>
              {this.props.documentTitle}
              <IconButton className="controls" style={{ width: 20, height: 20, float: "right" }}
                onClick={() =>
                  this.props.openEdit(EditFieldEnum.Title)
                }
              >
                <EditIcon />
              </IconButton>
            </div>
            {subtitle}
            <Grid container item xs={12}>
              {sections}
            </Grid>
            <div id="endAnchor" ></div>
          </Paper>
        </Grid>
      </div>
    );
  }

}

// Apply styles
const styledComponent = withStyles(styles)(PageComponent);

// Inject i18n resources
const localizedComponent = injectIntl(styledComponent);

export default localizedComponent;