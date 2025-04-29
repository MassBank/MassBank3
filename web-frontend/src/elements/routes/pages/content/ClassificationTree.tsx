import './ClassificationTree.scss';

import { useCallback, useMemo, Key, useState, useEffect } from 'react';
import { Content } from 'antd/es/layout/layout';
import ClassificationData from '../../../../types/ClassificationData';
import { Tree, TreeDataNode } from 'antd';
import ExportableContent from '../../../common/ExportableContent';
import LabelWrapper from '../../../basic/LabelWrapper';
import buildSearchUrl from '../../../../utils/buildSearchUrl';
import copyTextToClipboard from '../../../../utils/copyTextToClipboard';
import { usePropertiesContext } from '../../../../context/properties/properties';
import { EventDataNode } from 'antd/es/tree';

type InputProps = {
  data: ClassificationData;
  width: number;
  height: number;
  onSelect?: (selectedLabel: string) => void;
  selectedExpandedKeys?: string[];
};

function ClassificationTree({
  data,
  onSelect,
  width,
  height,
  selectedExpandedKeys = [],
}: InputProps) {
  const { baseUrl, frontendUrl } = usePropertiesContext();
  const handleOnCopy = useCallback((label: string, text: string) => {
    copyTextToClipboard(label, text);
  }, []);

  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (selectedExpandedKeys.length > 0) {
      setExpandedKeys(selectedExpandedKeys);
    } else {
      setExpandedKeys([]);
    }
  }, [selectedExpandedKeys]);

  const handleOnSelectTreeNode = useCallback(
    (selectedKey: string) => {
      if (onSelect) {
        onSelect(selectedKey);
      }
    },
    [onSelect],
  );

  const handleOnExpand = useCallback(
    (
      _expandedKeys: Key[],
      info: {
        node: EventDataNode<TreeDataNode>;
        expanded: boolean;
        nativeEvent: MouseEvent;
      },
    ) => {
      setExpandedKeys(_expandedKeys);

      let selectedKey = info.node.expanded
        ? data.hashmapParents.get(info.node.key as string)
        : (info.node.key as string);

      if (selectedKey === undefined || selectedKey === '') {
        selectedKey = 'Chemical compounds';
      }
      handleOnSelectTreeNode(selectedKey);
    },
    [data.hashmapParents, handleOnSelectTreeNode],
  );

  const treeData: TreeDataNode[] = useMemo(() => {
    const nodes: TreeDataNode[] = [];

    nodes.push({
      title: 'Chemical compounds',
      key: 'Chemical compounds',
      children: [],
    });

    const labelSet: Set<string> = new Set();
    for (const label of data.labels) {
      if (labelSet.has(label)) {
        continue; // Skip duplicate labels
      }

      const level = data.hashmapLevels.get(label);
      if (level !== undefined) {
        if (level === 0) {
          const node: TreeDataNode = {
            title: (
              <ExportableContent
                key={'class-label-' + label + '-chemont-tree-node-element'}
                component={<LabelWrapper value={label} />}
                mode="copy"
                onClick={() => handleOnCopy(`Compound class '${label}'`, label)}
                title={`Copy compound class '${label}' to clipboard`}
                enableSearch
                searchTitle={`Search for compound class '${label}'`}
                searchUrl={buildSearchUrl(
                  'compound_class',
                  label,
                  baseUrl,
                  frontendUrl,
                )}
              />
            ),
            key: label,
            children: [],
          };
          nodes[0].children!.push(node);
          labelSet.add(label); // Add label to set to avoid duplicates
        } else if (level === 1) {
          const rootLabel = data.hashmapParents.get(label);
          if (rootLabel !== undefined) {
            const root = nodes[0].children!.find(
              (node) => node.key === rootLabel,
            );
            if (root !== undefined) {
              const node: TreeDataNode = {
                title: (
                  <ExportableContent
                    key={'class-label-' + label + '-chemont-tree-node'}
                    component={<LabelWrapper value={label} />}
                    mode="copy"
                    onClick={() =>
                      handleOnCopy(`Compound class '${label}'`, label)
                    }
                    title={`Copy compound class '${label}' to clipboard`}
                    enableSearch
                    searchTitle={`Search for compound class '${label}'`}
                    searchUrl={buildSearchUrl(
                      'compound_class',
                      label,
                      baseUrl,
                      frontendUrl,
                    )}
                  />
                ),
                key: label,
                children: [],
              };
              root.children?.push(node);
              labelSet.add(label); // Add label to set to avoid duplicates
            }
          }
        } else if (level === 2) {
          const parentLabel = data.hashmapParents.get(label);
          if (parentLabel !== undefined) {
            const grandParentLabel = data.hashmapParents.get(parentLabel);
            if (grandParentLabel !== undefined) {
              const grandParentNode = nodes[0].children!.find(
                (node) => node.key === grandParentLabel,
              );
              if (grandParentNode !== undefined) {
                const parentNode = grandParentNode.children!.find(
                  (node) => node.key === parentLabel,
                );
                if (parentNode !== undefined) {
                  const node: TreeDataNode = {
                    title: (
                      <ExportableContent
                        key={'class-label-' + label + '-chemont-tree-node'}
                        component={<LabelWrapper value={label} />}
                        mode="copy"
                        onClick={() =>
                          handleOnCopy(`Compound class '${label}'`, label)
                        }
                        title={`Copy compound class '${label}' to clipboard`}
                        enableSearch
                        searchTitle={`Search for compound class '${label}'`}
                        searchUrl={buildSearchUrl(
                          'compound_class',
                          label,
                          baseUrl,
                          frontendUrl,
                        )}
                      />
                    ),
                    key: label,
                    children: [],
                  };
                  parentNode.children?.push(node);
                  labelSet.add(label); // Add label to set to avoid duplicates
                }
              }
            }
          }
        } else if (level === 3) {
          const parentLabel = data.hashmapParents.get(label);
          if (parentLabel !== undefined) {
            const grandParentLabel = data.hashmapParents.get(parentLabel);
            if (grandParentLabel !== undefined) {
              const grandGrandParentLabel =
                data.hashmapParents.get(grandParentLabel);
              if (grandGrandParentLabel !== undefined) {
                const grandGrandParentNode = nodes[0].children!.find(
                  (node) => node.key === grandGrandParentLabel,
                );
                if (grandGrandParentNode !== undefined) {
                  const grandParentNode = grandGrandParentNode.children!.find(
                    (node) => node.key === grandParentLabel,
                  );
                  if (grandParentNode !== undefined) {
                    const parentNode = grandParentNode.children!.find(
                      (node) => node.key === parentLabel,
                    );
                    if (parentNode !== undefined) {
                      const node: TreeDataNode = {
                        title: (
                          <ExportableContent
                            key={'class-label-' + label + '-chemont-tree-node'}
                            component={<LabelWrapper value={label} />}
                            mode="copy"
                            onClick={() =>
                              handleOnCopy(`Compound class '${label}'`, label)
                            }
                            title={`Copy compound class '${label}' to clipboard`}
                            enableSearch
                            searchTitle={`Search for compound class '${label}'`}
                            searchUrl={buildSearchUrl(
                              'compound_class',
                              label,
                              baseUrl,
                              frontendUrl,
                            )}
                          />
                        ),
                        key: label,
                        children: [],
                        isLeaf: true,
                      };
                      parentNode.children?.push(node);
                      labelSet.add(label); // Add label to set to avoid duplicates
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return nodes;
  }, [
    baseUrl,
    data.hashmapLevels,
    data.hashmapParents,
    data.labels,
    frontendUrl,
    handleOnCopy,
  ]);

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          overflow: 'scroll',
        }}
      >
        <Tree
          showLine
          treeData={treeData}
          expandedKeys={
            expandedKeys.length > 0
              ? expandedKeys
              : treeData.length > 0
                ? [treeData[0].key as Key]
                : []
          }
          onExpand={handleOnExpand}
        />
      </Content>
    ),
    [expandedKeys, handleOnExpand, height, treeData, width],
  );
}

export default ClassificationTree;
