import _ from 'lodash';
import React from 'react';

// BPMN diagram library
import BpmnJS from "bpmn-js/lib/NavigatedViewer";

// Components
import { createStyles, WithStyles } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

// Icons
import Icon from '@mdi/react';
import {
  mdiCheck,
  mdiMagnifyExpand,
} from '@mdi/js';

// State, routing and localization
import { injectIntl, IntlShape } from 'react-intl';

// Model
import { ApplicationConfiguration } from 'model/configuration';
import { BaseBpmIncident, ActiveProcessInstanceDetails, HistoryProcessInstanceDetails } from 'model/bpm-process-instance';

const styles = (theme: Theme) => createStyles({
  expandButton: {

  },
});

interface ProcessDiagramProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  instance: ActiveProcessInstanceDetails | HistoryProcessInstanceDetails;
  config: ApplicationConfiguration;
  fitViewport?: boolean;
}

const pathToSvg = (path: String, size: string): String => (
  `<svg viewBox="0 0 24 24" role="presentation" style="width: ${size}; height: {size};"><path d="${path}" style="fill: currentcolor;"></path></svg>`
);

const validTasks = ['userTask', 'serviceTask', 'intermediateMessageCatch'];

class ProcessDiagram extends React.Component<ProcessDiagramProps> {

  private containerRef: React.RefObject<HTMLDivElement> | null;

  private id: string;

  private viewer: any | null;

  constructor(props: ProcessDiagramProps) {
    super(props);

    this.id = _.uniqueId('diagram-');
    this.containerRef = React.createRef<HTMLDivElement>();
  }

  static defaultProps = {
    fitViewport: false,
  }

  componentDidMount() {
    const { instance, instance: { bpmn2Xml }, fitViewport } = this.props;

    this.viewer = new BpmnJS({
      container: `#${this.id}`
    });

    this.viewer.importXML(bpmn2Xml)
      .then(() => {
        const overlays = this.viewer.get('overlays');

        const executions: string[] = [];

        // Completed tasks
        instance.activities.filter(a => a.startTime !== null && a.endTime !== null).forEach(a => {
          const icon = pathToSvg(mdiCheck, '1rem');

          if (!validTasks.includes(a.activityType)) {
            return;
          }

          overlays.add(a.activityId, 'note', {
            position: {
              bottom: 12,
              left: -12,
            },
            scale: true,
            html: `<div class="bpmn-task-completed"><i class="bpmn-icon">${icon}</i></div>`,
          });
        });


        // Running tasks
        instance.activities.filter(a => a.startTime !== null && a.endTime === null).forEach(a => {
          if (!executions.includes(a.executionId)) {
            executions.push(a.executionId);
          }
          const executionId = executions.findIndex(e => e === a.executionId) + 1;
          const incident = (instance.incidents as BaseBpmIncident[]).find(i => i.executionId === a.executionId) || null;

          overlays.add(a.activityId, 'note', {
            position: {
              bottom: 12,
              left: -12,
            },
            scale: true,
            html: `<div class="bpmn-execution">${executionId}</div>`,
          });

          if (incident) {
            overlays.add(a.activityId, 'note', {
              position: {
                bottom: 12,
                left: 16,
              },
              scale: true,
              html: `<div class="bpmn-incident">${executionId}</div>`,
            });
          }
        });

        if (fitViewport) {
          this.viewer.get('canvas').zoom('fit-viewport');
        }
      }).catch(function (err: any) {
        const { warnings, message } = err;

        console.log('Diagram:', warnings, message);
      });
  }

  componentWillUnmount() {
    this.viewer.destroy();
  }

  fitToViewport() {
    this.viewer.get('canvas').zoom('fit-viewport');
  }

  render() {

    const { classes } = this.props;
    return (
      <div ref={this.containerRef} id={this.id} style={{ height: 'calc(100vh - 220px)', width: '100%', padding: 0, margin: 0, background: '#ffffff' }}>
        <IconButton
          color="primary" aria-label="upload picture"
          component="span"
          className={classes.expandButton}
          onClick={() => this.fitToViewport()}
        >
          <Icon path={mdiMagnifyExpand} size="1.2rem" />
        </IconButton>
      </div >
    );
  }
}

// Apply styles
const StyledComponent = withStyles(styles)(ProcessDiagram);

// Inject i18n resources
const LocalizedComponent = injectIntl(StyledComponent);

export default LocalizedComponent;