import React from 'react';
import { Avatar, Heading, Text, HStack, VStack, Icon, Link } from 'native-base';
import { Event } from '../types';
import { Entypo } from '@expo/vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import moment from 'moment';
import { createMapLink } from 'react-native-open-maps';

TimeAgo.addLocale(en);
const timeFormatter = new TimeAgo('en-US');

interface EventProps {
    event: Event;
}

const EventView: React.FC<EventProps> = ({ event }) => {
    return (
        <HStack
            w={['90%', '80%', '60%', '50%']}
            bg="white"
            p={2}
            m={2}
            borderWidth={1}
            borderRadius={5}
            borderColor="gray.400"
            space={2}
        >
            <Avatar
                source={require('../../assets/profile_image_placeholder.png')}
                size="xl"
            />
            <VStack flex={1} space={5} m={2}>
                <HStack>
                    <VStack flex={1}>
                        <Heading size="sm" paddingLeft={0}>
                            {event.title}
                        </Heading>
                        <HStack>
                            <Icon
                                as={Entypo}
                                name="location-pin"
                                size="md"
                                color="primary.600"
                            />
                            <Link
                                href={createMapLink({ query: event.location })}
                                isUnderlined={false}
                                isExternal
                                _text={{
                                    color: 'primary.600'
                                }}
                            >
                                {event.location}
                            </Link>
                        </HStack>
                    </VStack>
                    <Text color="gray.500" paddingRight={0}>
                        {timeFormatter.format(
                            moment
                                .utc(
                                    event.created_datetime,
                                    'YYYY-MM-DDTHH:mm:ss'
                                )
                                .toDate(),
                            'twitter'
                        )}
                    </Text>
                </HStack>
                <Text>{event.description}</Text>
            </VStack>
        </HStack>
    );
};

export default EventView;
