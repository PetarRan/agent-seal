use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, Addr, Uint128, Timestamp,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub admin: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    LogAgentAction {
        agent_id: String,
        timestamp: u64,
        action_type: String,
        action_metadata: String,
        signature: String,
        agent_address: String,
    },
    VerifyAction {
        agent_id: String,
        timestamp: u64,
        action_type: String,
        signature: String,
        agent_address: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetAgentActions { agent_id: String },
    GetActionByTx { tx_hash: String },
    VerifyAction {
        agent_id: String,
        timestamp: u64,
        action_type: String,
        signature: String,
        agent_address: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AgentAction {
    pub agent_id: String,
    pub timestamp: u64,
    pub action_type: String,
    pub action_metadata: String,
    pub signature: String,
    pub agent_address: String,
    pub tx_hash: String,
    pub verified: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AgentActionsResponse {
    pub actions: Vec<AgentAction>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct VerifyActionResponse {
    pub verified: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateResponse {
    pub admin: String,
}

// State
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub admin: Addr,
    pub actions: Vec<AgentAction>,
}

pub const STATE: Item<State> = Item::new("state");

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State {
        admin: deps.api.addr_validate(&msg.admin)?,
        actions: vec![],
    };
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", msg.admin))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::LogAgentAction {
            agent_id,
            timestamp,
            action_type,
            action_metadata,
            signature,
            agent_address,
        } => execute_log_agent_action(
            deps,
            env,
            info,
            agent_id,
            timestamp,
            action_type,
            action_metadata,
            signature,
            agent_address,
        ),
        ExecuteMsg::VerifyAction {
            agent_id,
            timestamp,
            action_type,
            signature,
            agent_address,
        } => execute_verify_action(
            deps,
            env,
            info,
            agent_id,
            timestamp,
            action_type,
            signature,
            agent_address,
        ),
    }
}

pub fn execute_log_agent_action(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    agent_id: String,
    timestamp: u64,
    action_type: String,
    action_metadata: String,
    signature: String,
    agent_address: String,
) -> StdResult<Response> {
    let mut state = STATE.load(deps.storage)?;

    // Create new action
    let action = AgentAction {
        agent_id,
        timestamp,
        action_type,
        action_metadata,
        signature,
        agent_address,
        tx_hash: env.transaction.hash.to_string(),
        verified: false, // Will be verified separately
    };

    // Add to state
    state.actions.push(action);
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "log_agent_action")
        .add_attribute("agent_id", agent_id)
        .add_attribute("action_type", action_type)
        .add_attribute("tx_hash", env.transaction.hash.to_string()))
}

pub fn execute_verify_action(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    agent_id: String,
    timestamp: u64,
    action_type: String,
    signature: String,
    agent_address: String,
) -> StdResult<Response> {
    let mut state = STATE.load(deps.storage)?;

    // Find and verify the action
    for action in &mut state.actions {
        if action.agent_id == agent_id 
            && action.timestamp == timestamp 
            && action.action_type == action_type 
            && action.agent_address == agent_address {
            
            // Verify signature (simplified verification)
            if action.signature == signature {
                action.verified = true;
                STATE.save(deps.storage, &state)?;
                
                return Ok(Response::new()
                    .add_attribute("method", "verify_action")
                    .add_attribute("verified", "true")
                    .add_attribute("agent_id", agent_id));
            }
        }
    }

    Ok(Response::new()
        .add_attribute("method", "verify_action")
        .add_attribute("verified", "false")
        .add_attribute("agent_id", agent_id))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAgentActions { agent_id } => {
            to_binary(&query_agent_actions(deps, agent_id)?)
        }
        QueryMsg::GetActionByTx { tx_hash } => {
            to_binary(&query_action_by_tx(deps, tx_hash)?)
        }
        QueryMsg::VerifyAction {
            agent_id,
            timestamp,
            action_type,
            signature,
            agent_address,
        } => {
            to_binary(&query_verify_action(
                deps,
                agent_id,
                timestamp,
                action_type,
                signature,
                agent_address,
            )?)
        }
    }
}

fn query_agent_actions(deps: Deps, agent_id: String) -> StdResult<AgentActionsResponse> {
    let state = STATE.load(deps.storage)?;
    let actions: Vec<AgentAction> = state
        .actions
        .into_iter()
        .filter(|action| action.agent_id == agent_id)
        .collect();

    Ok(AgentActionsResponse { actions })
}

fn query_action_by_tx(deps: Deps, tx_hash: String) -> StdResult<Option<AgentAction>> {
    let state = STATE.load(deps.storage)?;
    let action = state
        .actions
        .into_iter()
        .find(|action| action.tx_hash == tx_hash);

    Ok(action)
}

fn query_verify_action(
    deps: Deps,
    agent_id: String,
    timestamp: u64,
    action_type: String,
    signature: String,
    agent_address: String,
) -> StdResult<VerifyActionResponse> {
    let state = STATE.load(deps.storage)?;
    
    for action in state.actions {
        if action.agent_id == agent_id 
            && action.timestamp == timestamp 
            && action.action_type == action_type 
            && action.agent_address == agent_address 
            && action.signature == signature {
            return Ok(VerifyActionResponse { verified: true });
        }
    }

    Ok(VerifyActionResponse { verified: false })
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "earth"));

        let msg = InstantiateMsg {
            admin: "creator".to_string(),
        };

        let res = instantiate(deps.as_mut(), env, info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }

    #[test]
    fn test_log_agent_action() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "earth"));

        // Instantiate
        let msg = InstantiateMsg {
            admin: "creator".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

        // Log action
        let msg = ExecuteMsg::LogAgentAction {
            agent_id: "agent_001".to_string(),
            timestamp: 1234567890,
            action_type: "task_completion".to_string(),
            action_metadata: "Completed task".to_string(),
            signature: "signature_123".to_string(),
            agent_address: "xion1...".to_string(),
        };

        let res = execute(deps.as_mut(), env, info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }
}
