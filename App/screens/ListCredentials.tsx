import React, { useState, useEffect, useContext } from 'react'

import { Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import AgentContext from '../contexts/AgentProvider'
import { CredentialEventType } from 'aries-framework'

interface Props {
  navigation: any
}

const ListCredentials: React.FC<Props> = ({ navigation }) => {
  //Reference to the agent context
  const agentContext = useContext<any>(AgentContext)

  //Credential List State
  const [credentials, setCredentials] = useState<any>()

  //Function to get all credentials and set the state
  const getCredentials = async () => {
    const credentials = await agentContext.agent.credentials.getAll()
    console.log(credentials)

    const credentialsForDisplay = []

    for (const credential of credentials) {
      if (credential.state === 'done') {
        const credentialToDisplay = {
          ...(await agentContext.agent.credentials.getIndyCredential(credential.credentialId)),
          connectionId: credential.connectionId,
          id: credential.id,
        }
        credentialsForDisplay.push(credentialToDisplay)
      }
    }
    console.log('credentialsForDisplay', credentialsForDisplay)
    //TODO: Filter credentials for display
    setCredentials(credentialsForDisplay)
  }

  //On Component Load Fetch all Connections
  useEffect(() => {
    if (!agentContext.loading) {
      getCredentials()
    }
  }, [agentContext.loading])

  //Credential Event Callback
  const handleCredentialStateChange = async (event: any) => {
    console.info(`Credentials State Change, new state: "${event.credentialRecord.state}"`, event)

    getCredentials()
  }

  //Register Event Listener
  useEffect(() => {
    if (!agentContext.loading) {
      agentContext.agent.credentials.events.removeAllListeners(CredentialEventType.StateChanged)
      agentContext.agent.credentials.events.on(CredentialEventType.StateChanged, handleCredentialStateChange)
    }
  }, [agentContext.loading])

  const [viewInfo, setViewInfo] = useState('')
  const [viewCredential, setViewCredential] = useState(false)

  const renderCred = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          navigation.navigate('CredentialDetails', { alias: item.alias })
        }}
        style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Text style={{ fontSize: 20 }}>{item.alias ? item.alias : item.invitation.label}</Text>
        <Icon name="chevron-right" size={30} style={{ bottom: 2 }} />
      </TouchableOpacity>
    )
  }

  const FAKE_CREDS = [
    {
      id: 1,
      alias: 'Intermountain Health',
    },
    {
      id: 2,
      alias: 'DR. JEFF DDS',
    },
    {
      id: 3,
      alias: 'Pocamo Pediatrics',
    },
  ]

  return (
    <FlatList data={FAKE_CREDS} renderItem={renderCred} style={{ backgroundColor: 'white' }} />
    /* <BackButton backPath={'/home'} />
      <View style={AppStyles.viewFull}>
        <View style={AppStyles.header}>
          <AppHeader headerText={'CREDENTIALS'} />
        </View>
        <View style={[Styles.credView, AppStyles.backgroundSecondary]}>
          <TouchableOpacity
            style={Styles.backbutton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => history.push('/home')}
          >
            <Image source={Images.arrowDown} style={AppStyles.arrow} />
          </TouchableOpacity>
          {credentials.map((credential, i) => (
            <View key={i} style={[AppStyles.tableItem, Styles.tableItem, AppStyles.backgroundSecondary]}>
              <View>
                <Text style={[{ fontSize: 18, top: 8 }, AppStyles.textWhite, AppStyles.textBold]}>
                  Driver's License
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setViewInfo(credential)
                  setViewCredential(true)
                }}
              >
                <Image source={Images.infoWhite} style={[AppStyles.info, { marginRight: 10, top: 10 }]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      {viewCredential ? <CurrentCredential credential={viewInfo} setViewCredential={setViewCredential} /> : null} */
  )
}

export default ListCredentials

const styles = StyleSheet.create({
  backbutton: {
    marginBottom: 30,
  },
  tableItem: {
    paddingLeft: 30,
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
  tableSubItem: {
    height: 50,
  },
  credView: {
    alignItems: 'center',
    padding: 12,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: '100%',
  },
})
