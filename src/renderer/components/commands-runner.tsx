import { Button, IButtonProps, Spinner } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import * as React from 'react';

import { VersionState } from '../../interfaces';
import { AppState } from '../state';

export interface RunnerState {
}

export interface RunnerProps {
  appState: AppState;
}

/**
 * The runner component is responsible for actually launching the fiddle
 * with Electron. It also renders the button that does so.
 *
 * @class Runner
 * @extends {React.Component<RunnerProps, RunnerState>}
 */
@observer
export class Runner extends React.Component<RunnerProps, RunnerState> {
  public render() {
    const { isRunning, currentElectronVersion } = this.props.appState;

    const state = currentElectronVersion && currentElectronVersion.state;
    const props: IButtonProps = { className: 'button-run', disabled: true };

    if (state === VersionState.downloading) {
      props.text = 'Downloading';
      props.icon = <Spinner size={16} value={currentElectronVersion?.downloadProgress} />;
    } else if (state === VersionState.unzipping) {
      props.text = 'Unzipping';
      props.icon = <Spinner size={16} />;
    } else if (state === VersionState.ready) {
      props.disabled = false;

      if (isRunning) {
        props.active = true;
        props.text = 'Stop';
        props.onClick = window.ElectronFiddle.app.runner.stop;
        props.icon = 'stop';
      } else {
        props.text = 'Run';
        props.onClick = window.ElectronFiddle.app.runner.run;
        props.icon = 'play';
      }
    } else {
      props.text = 'Checking status';
      props.icon = <Spinner size={16} />;
    }

    return <Button {...props} type={undefined} />;
  }
}
