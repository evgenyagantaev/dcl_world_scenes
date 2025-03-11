/// <reference lib="dom" />

import React from 'react';
import { render } from '@testing-library/react';

// Mock @dcl/sdk/react-ecs to ensure a proper React.createElement function is available
jest.mock('@dcl/sdk/react-ecs', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React,
    Button: (props: any) => React.createElement('div', props),
    Input: (props: any) => React.createElement('input', props),
    Label: (props: any) => React.createElement('label', props),
    ReactEcsRenderer: {},
    UiEntity: (props: any) => React.createElement('div', props)
  };
});

// Mock getDialogVisibility from npcController
jest.mock('../src/npcController', () => ({
  getDialogVisibility: jest.fn()
}));

// Mock @dcl/sdk/math to provide Color4.Clear and others, with explicit types for parameters
jest.mock('@dcl/sdk/math', () => ({
  Color4: {
    Clear: () => '#000000',
    create: (r: number, g: number, b: number, a: number) => ({ r, g, b, a }),
    White: () => '#ffffff',
    Gray: () => '#888888',
    Green: () => '#00ff00',
    Red: () => '#ff0000'
  }
}));

import { CuratorChatUiEntity } from '../src/curator_chat_ui';
import { getDialogVisibility } from '../src/npcController';

describe('CuratorChatUiEntity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render null when dialog is not visible', () => {
    (getDialogVisibility as jest.Mock).mockReturnValue(false);
    const Component = CuratorChatUiEntity();
    const element = Component();
    const { container } = render(element as any);
    expect(container.firstChild).toBeNull();
  });

  test('should render component when dialog is visible', () => {
    (getDialogVisibility as jest.Mock).mockReturnValue(true);
    const Component = CuratorChatUiEntity();
    const element = Component();
    const { container } = render(element as any);
    expect(container.firstChild).not.toBeNull();
  });
}); 