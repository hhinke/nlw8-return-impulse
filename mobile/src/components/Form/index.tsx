import { ArrowLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { captureScreen } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';

import { FeedbackType } from '../../components/Widget';
import { ScreenshotButton } from '../../components/ScreenshotButton';
import { Button } from '../../components/Button';

import { theme } from '../../theme';
import { styles } from './styles';
import { feedbackTypes } from '../../utils/feedbackTypes'
import { api } from '../../libs/api';

interface Props {
 feedbackType: FeedbackType;
 onFeedbackCancelled: () => void;
 onFeedbackSent: () => void;
}

export function Form({ feedbackType, onFeedbackCancelled, onFeedbackSent }: Props) {
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);
    const [comment, setcomment] = useState('');
    const feedbackTypeInfo = feedbackTypes[feedbackType];

    function handleScreenshot() {
        captureScreen({
            format: 'jpg',
            quality: 0.8
        }).then(uri => setScreenshot(uri))
        .catch(error => console.log(error));
    }

    function handleScreenshotRemove() {
        setScreenshot(null);
    }

    async function handleSendFeedback() {
        if(isSendingFeedback) {
            return;
        }

        setIsSendingFeedback(true);

        const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64'});

        try {
            await api.post('/feedbacks', {
                type: feedbackType,
                screenshot: `data:image/png;base64,${screenshotBase64}`,
                comment
            });

            onFeedbackSent();
        } catch (err) {
            console.log(err);
            setIsSendingFeedback(false);
        }

    }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={onFeedbackCancelled}>
                <ArrowLeft 
                    size={24}
                    weight='bold'
                    color={theme.colors.text_secondary}
                />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Image 
                    source={feedbackTypeInfo.image}
                    style={styles.image}
                />
                <Text style={styles.titleText}>
                    {feedbackTypeInfo.title}
                </Text>
            </View>
        </View>

        <TextInput multiline
            autoCorrect={false}
            onChangeText={setcomment}
            style={styles.input}
            placeholder='Conte com detalhe o que esta acontecendo.'
            placeholderTextColor={theme.colors.text_secondary}
        />
        <View style={styles.footer}>
            <ScreenshotButton 
                onTakeShot={handleScreenshot} 
                onRemoveShot={handleScreenshotRemove}
                screenshot={screenshot}
            />

            <Button  
                isLoading={isSendingFeedback} 
                onPress={handleSendFeedback}
            />
        </View>
    </View>
  );
}