import * as AWS from "@aws-sdk/client-textract";
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import awsConfig from '../../config/aws.config';
import * as dataJson from '../_mock/data.json'
import * as dataJson3 from '../_mock/data3.json'

@Injectable()
export class OcrService {
    private client: any
    constructor(
        @Inject(awsConfig.KEY)
        private readonly configService: ConfigType<typeof awsConfig>,
    ) {
        // this.client = new AWS.Textract({
        //     region: this.configService.awsRegion
        // });
    }

    getText(result, blocksMap) {
        let text = "";
        if (Object.prototype.hasOwnProperty.call(result, "Relationships")) {
            result.Relationships.forEach(relationship => {
                if (relationship.Type === "CHILD") {
                    relationship.Ids.forEach(childId => {
                        const word = blocksMap[childId];
                        if (word.BlockType === "WORD") {
                            text += `${word.Text} `;
                        }
                        if (word.BlockType === "SELECTION_ELEMENT") {
                            if (word.SelectionStatus === "SELECTED") {
                                text += `X `;
                            }
                        }
                    });
                }
            });
        }

        return text.trim();
    };

    findValueBlock(keyBlock, valueMap) {
        let valueBlock;
        keyBlock.Relationships.forEach(relationship => {
            if (relationship.Type === "VALUE") {
                // eslint-disable-next-line array-callback-return
                relationship.Ids.every(valueId => {
                    if (Object.prototype.hasOwnProperty.call(valueMap, valueId)) {
                        valueBlock = valueMap[valueId];
                        return false;
                    }
                });
            }
        });

        return valueBlock;
    };

    getKeyValueRelationship(keyMap, valueMap, blockMap) {
        const keyValues = {};

        const keyMapValues = Object.values(keyMap);
        keyMapValues.forEach(keyMapValue => {
            const valueBlock = this.findValueBlock(keyMapValue, valueMap);
            const key = this.getText(keyMapValue, blockMap);
            const value = this.getText(valueBlock, blockMap);
            keyValues[key] = value;
        });

        return keyValues;
    };

    getKeyValueMap(blocks) {
        const keyMap = {};
        const valueMap = {};
        const blockMap = {};

        let blockId;
        blocks.forEach(block => {
            blockId = block.Id;
            blockMap[blockId] = block;

            if (block.BlockType === "KEY_VALUE_SET") {
                if (block.EntityTypes.includes("KEY")) {
                    keyMap[blockId] = block;
                } else {
                    valueMap[blockId] = block;
                }
            }
        });

        return { keyMap, valueMap, blockMap };
    };

    async parseImage(imageBuffer) {
        try {
            const params = {
                Document: {
                    Bytes: imageBuffer
                },
                FeatureTypes: ["FORMS"]
            };
            // const data = await this.client.analyzeDocument(params);
            // return data
            const data = dataJson
            if (data && data.Blocks) {
                const { keyMap, valueMap, blockMap } = this.getKeyValueMap(data.Blocks);
                const keyValues = this.getKeyValueRelationship(keyMap, valueMap, blockMap);
                return keyValues;
            }
            return undefined
        } catch (error) {
            console.log(error)
        } finally {
            console.log('Finish')
        }
    }
}
