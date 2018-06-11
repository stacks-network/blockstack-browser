import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import { openInNewTab, getWebAccountTypes, getIconClass, getIdentifier, getIdentifierType } from '@utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class SocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool,
    pending: PropTypes.bool,
    api: PropTypes.object.isRequired,
    placeholder: PropTypes.bool,
    onClick: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.getAccountUrl = this.getAccountUrl.bind(this)
    // this.onClick = this.onClick.bind(this)
  }

  getAccountUrl() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        const urlTemplate = webAccountTypes[this.props.service].urlTemplate
        if (urlTemplate) {
          accountUrl = urlTemplate.replace('{identifier}', this.props.identifier)
        }
      }
    }
    return accountUrl
  }

  getPlaceholderText = (service) => (
    <span className="app-account-service font-weight-normal">
      Add your <span className="text-capitalize">{service}</span> {getIdentifierType(service)}
    </span>
  )

  onClick = () => {
    this.props.onClick(this.props.service)
  }

  onVerifiedCheckmarkClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openInNewTab(this.props.proofUrl)
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const webAccountType = webAccountTypes[this.props.service]
    const verified = this.props.verified
    const pending = this.props.pending
    const verifiedClass = verified ? 'verified' : 'pending'
    const placeholderClass = this.props.placeholder ? 'placeholder' : ''

    if (webAccountType) {
      const accountServiceName = webAccountType.label
      if (this.props.listItem === true) {
        return (
          <li className={`clickable ${verifiedClass} ${placeholderClass}`} onClick={this.onClick}>
            {!pending &&
              <ReactTooltip
                place="top"
                type="dark"
                effect="solid"
                id={`verified-${this.props.service}`}
                className="text-center"
              >
                {verified && 'Verified'}
              </ReactTooltip>
            }

            <span className="app-account-icon">
              <i className={`fa fa-fw ${getIconClass(this.props.api, this.props.service)} fa-lg`} />
            </span>

            {!this.props.placeholder && (
              <span className="app-account-identifier">
                {getIdentifier(this.props.identifier)}
              </span>
            )}

            {(!this.props.placeholder && this.props.editing) && (
              <span className="">
                <i className="fa fa-fw fa-pencil" />
              </span>
            )}

            {!this.props.placeholder && (
              <span className="app-account-service font-weight-normal">
                {`@${accountServiceName}`}
              </span>
            )}

            {this.props.placeholder && (
              <span className="app-account-service font-weight-normal">
                {this.getPlaceholderText(this.props.service)}
              </span>
            )}

            {verified &&
              <span
                className="float-right status"
                data-tip
                data-for={`verified-${this.props.service}`}
                onClick={this.onVerifiedCheckmarkClick}
              >
                <i className="fa fa-fw fa-check-circle fa-lg" />
              </span>
            }
            {!verified && 
              (this.props.placeholder) ?
              <span className="float-right star">+1<i className="fa fa-w fa-star-o" /></span>
              :
              <span className="float-right badge badge-danger badge-verification">Unverified</span>
            }
          </li>
        )
      } else {
        return (
          <span>
            <i className={`fa ${getIconClass(this.props.api, this.props.service)}`} />
            <span>{getIdentifier(this.props.identifier)}</span>
          </span>
        )
      }
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(SocialAccountItem)
