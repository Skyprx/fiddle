import { shallow } from 'enzyme';
import * as React from 'react';
import { EditorValues } from '../../../src/interfaces';

import { SidebarFileTree } from '../../../src/renderer/components/sidebar-file-tree';
import {
  EditorMosaic,
  EditorPresence,
} from '../../../src/renderer/editor-mosaic';
import { createEditorValues } from '../../mocks/editor-values';

describe('SidebarFileTree component', () => {
  let store: any;
  let editorMosaic: EditorMosaic;
  let editorValues: EditorValues;

  beforeEach(() => {
    store = {};
    editorValues = createEditorValues();
    editorMosaic = new EditorMosaic();
    editorMosaic.set(editorValues);
    store.editorMosaic = editorMosaic as any;
  });

  it('renders', () => {
    const wrapper = shallow(<SidebarFileTree appState={store} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('reflects the visibility state of all icons', () => {
    editorMosaic.hide('index.html');
    const wrapper = shallow(<SidebarFileTree appState={store} />);

    // snapshot has an 'eye-off' icon
    expect(wrapper).toMatchSnapshot();
  });

  it('can bring up the Add File input', () => {
    const wrapper = shallow(<SidebarFileTree appState={store} />);
    const instance: SidebarFileTree = wrapper.instance() as any;

    instance.setState({ action: 'add' });

    // snapshot has the input rendered
    expect(wrapper).toMatchSnapshot();
  });

  it('can toggle editor visibility', () => {
    const wrapper = shallow(<SidebarFileTree appState={store} />);
    const instance: SidebarFileTree = wrapper.instance() as any;

    instance.toggleVisibility('index.html');

    expect(editorMosaic.files.get('index.html')).toBe(EditorPresence.Hidden);
  });

  it('can create new editors', () => {
    const wrapper = shallow(<SidebarFileTree appState={store} />);
    const instance: SidebarFileTree = wrapper.instance() as any;

    expect(editorMosaic.files.get('tester.js')).toBe(undefined);
    instance.createEditor('tester.js');
    expect(editorMosaic.files.get('tester.js')).toBe(EditorPresence.Pending);
  });

  it('can delete editors', () => {
    const wrapper = shallow(<SidebarFileTree appState={store} />);
    const instance: SidebarFileTree = wrapper.instance() as any;

    expect(editorMosaic.files.get('index.html')).toBe(EditorPresence.Pending);
    instance.removeEditor('index.html');
    expect(editorMosaic.files.get('index.html')).toBe(undefined);
  });

  it('can reset the editor layout', () => {
    const wrapper = shallow(<SidebarFileTree appState={store} />);
    const instance: SidebarFileTree = wrapper.instance() as any;

    editorMosaic.resetLayout = jest.fn();

    instance.resetLayout();

    expect(editorMosaic.resetLayout).toHaveBeenCalledTimes(1);
  });
});
