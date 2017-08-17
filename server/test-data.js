/* eslint-disable key-spacing */

exports.ROOM_RTP_CAPABILITIES =
{
	codecs:
	[
		{
			name: 'PCMA',
			mimeType: 'audio/PCMA',
			kind: 'audio',
			clockRate: 8000,
			preferredPayloadType: 8,
			rtcpFeedback: [],
			parameters: {}
		},
		{
			name: 'opus',
			mimeType: 'audio/opus',
			kind: 'audio',
			clockRate: 48000,
			channels: 2,
			preferredPayloadType: 96,
			rtcpFeedback: [],
			parameters: {}
		},
		{
			name: 'SILK',
			mimeType: 'audio/SILK',
			kind: 'audio',
			clockRate: 16000,
			preferredPayloadType: 97,
			rtcpFeedback: [],
			parameters: {}
		},
		{
			name: 'VP9',
			mimeType: 'video/VP9',
			kind: 'video',
			clockRate: 90000,
			preferredPayloadType: 102,
			rtcpFeedback:
			[
				{
					parameter: '',
					type: 'nack'
				},
				{
					parameter: 'pli',
					type: 'nack'
				},
				{
					parameter: '',
					type: 'goog-remb'
				},
				{
					parameter: 'bar',
					type: 'foo'
				}
			],
			parameters: {}
		},
		{
			name: 'rtx',
			mimeType: 'video/rtx',
			kind: 'video',
			clockRate: 90000,
			preferredPayloadType: 103,
			rtcpFeedback: [],
			parameters: {
				apt: 102
			}
		},
		{
			name: 'VP8',
			mimeType: 'video/VP8',
			kind: 'video',
			clockRate: 90000,
			preferredPayloadType: 100,
			rtcpFeedback:
			[
				{
					parameter: '',
					type: 'nack'
				},
				{
					parameter: 'pli',
					type: 'nack'
				},
				{
					parameter: '',
					type: 'goog-remb'
				},
				{
					parameter: 'bar',
					type: 'foo'
				}
			],
			parameters: {}
		},
		{
			name: 'rtx',
			mimeType: 'video/rtx',
			kind: 'video',
			clockRate: 90000,
			preferredPayloadType: 101,
			rtcpFeedback: [],
			parameters: {
				apt: 100
			}
		}
	],
	headerExtensions: [
		{
			kind: 'audio',
			uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
			preferredId: 10
		},
		{
			kind: 'video',
			uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
			preferredId: 11
		},
		{
			kind: 'video',
			uri: 'http://foo.bar',
			preferredId: 12
		}
	],
	fecMechanisms: []
};

exports.QUERY_ROOM_RESPONSE =
{
	rtpCapabilities: exports.ROOM_RTP_CAPABILITIES,
	__mandatoryCodecPayloadTypes: [ 8, 96, 100 ]
};

exports.JOIN_ROOM_RESPONSE =
{
	peers:
	[
		{
			name: 'alice',
			appData:
			{
				displayName: 'Alice Thomsom',
				device: { name: 'Firefox', version: '50' }
			},
			consumers:
			[
				{
					id: 3333,
					kind: 'audio',
					paused: false,
					appData: { source: 'mic' },
					rtpParameters:
					{
						muxId: null,
						codecs:
						[
							{
								name: 'PCMA',
								mimeType: 'audio/PCMA',
								clockRate: 8000,
								payloadType: 8,
								rtcpFeedback: [],
								parameters: {}
							}
						],
						headerExtensions:
						[
							{
								uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
								id: 1
							}
						],
						encodings:
						[
							{
								ssrc: 33333333
							}
						],
						rtcp:
						{
							cname: 'ALICECNAME',
							reducedSize: true,
							mux: true
						}
					}
				},
				{
					id: 4444,
					kind: 'video',
					appData: { source: 'webcam' },
					rtpParameters:
					{
						muxId: null,
						codecs:
						[
							{
								name: 'VP8',
								mimeType: 'video/VP8',
								clockRate: 90000,
								payloadType: 100,
								rtcpFeedback:
								[
									{
										parameter: '',
										type: 'nack'
									},
									{
										parameter: 'pli',
										type: 'nack'
									},
									{
										parameter: '',
										type: 'goog-remb'
									},
									{
										parameter: 'bar',
										type: 'foo'
									}
								],
								parameters: {}
							},
							{
								name: 'rtx',
								mimeType: 'video/rtx',
								clockRate: 90000,
								payloadType: 101,
								rtcpFeedback: [],
								parameters: {
									apt: 100
								}
							}
						],
						headerExtensions:
						[
							{
								kind: 'video',
								uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
								id: 11
							},
							{
								kind: 'video',
								uri: 'http://foo.bar',
								id: 12
							}
						],
						encodings:
						[
							{
								ssrc: 444444441,
								rtx: {
									ssrc: 444444442
								}
							}
						],
						rtcp:
						{
							cname: 'ALICECNAME',
							reducedSize: true,
							mux: true
						}
					}
				}
			]
		},
		{
			name: 'carol',
			appData:
			{
				displayName: 'Carol McCain',
				device: { name: 'Microsoft Edge', version: '11' }
			},
			consumers:
			[
				{
					id: 9999,
					kind: 'audio',
					paused: false,
					appData: { source: 'mic' },
					rtpParameters:
					{
						muxId: null,
						codecs:
						[
							{
								name: 'PCMA',
								mimeType: 'audio/PCMA',
								clockRate: 8000,
								payloadType: 8,
								rtcpFeedback: [],
								parameters: {}
							}
						],
						headerExtensions:
						[
							{
								uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
								id: 1
							}
						],
						encodings:
						[
							{
								ssrc: 99999999
							}
						],
						rtcp:
						{
							cname: 'CAROLCNAME',
							reducedSize: true,
							mux: true
						}
					}
				}
			]
		}
	]
};

exports.CREATE_TRANSPORT_1_RESPONSE =
{
	iceParameters:
	{
		usernameFragment: 'server-usernamefragment-12345678',
		password: 'server-password-xxxxxxxx',
		iceLite: true
	},
	iceCandidates:
	[
		{
			foundation: 'F1',
			priority: 1234,
			ip: '1.2.3.4',
			protocol: 'udp',
			port: 9999,
			type: 'host'
		}
	],
	dtlsParameters:
	{
		fingerprints:
		[
			{
				algorithm: 'sha-256',
				value: 'FF:FF:39:66:A4:E2:66:60:30:18:A7:59:B3:AF:A5:33:58:5E:7F:69:A4:62:A6:D4:EB:9F:B7:42:05:35:FF:FF'
			}
		],
		role: 'client'
	}
};

exports.CREATE_TRANSPORT_2_RESPONSE =
{
	iceParameters:
	{
		usernameFragment: 'server-usernamefragment-12345678',
		password: 'server-password-xxxxxxxx',
		iceLite: true
	},
	iceCandidates:
	[
		{
			foundation: 'F1',
			priority: 1234,
			ip: '1.2.3.4',
			protocol: 'udp',
			port: 9999,
			type: 'host'
		}
	],
	dtlsParameters:
	{
		fingerprints:
		[
			{
				algorithm: 'sha-256',
				value: 'FF:FF:39:66:A4:E2:66:60:30:18:A7:59:B3:AF:A5:33:58:5E:7F:69:A4:62:A6:D4:EB:9F:B7:42:05:35:FF:FF'
			}
		],
		role: 'auto'
	}
};

exports.BOB_NEW_PEER_NOTIFICATION =
{
	method: 'newPeer',
	notification: true,
	name: 'bob',
	appData:
	{
		displayName: 'Bob Smith',
		device: { name: 'Safari', version: '11' }
	},
	consumers:
	[
		{
			id: 6666,
			kind: 'audio',
			paused: false,
			appData: { source: 'mic' },
			rtpParameters:
			{
				muxId: null,
				codecs:
				[
					{
						name: 'opus',
						mimeType: 'audio/opus',
						clockRate: 48000,
						channels: 2,
						payloadType: 96,
						rtcpFeedback: [],
						parameters: {}
					}
				],
				headerExtensions:
				[
					{
						uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
						id: 1
					}
				],
				encodings:
				[
					{
						ssrc: 66666666
					}
				],
				rtcp:
				{
					cname: 'BOBCNAME',
					reducedSize: true,
					mux: true
				}
			}
		}
	]
};

exports.BOB_WEBCAM_NEW_CONSUMER_NOTIFICATION =
{
	method: 'newConsumer',
	notification: true,
	id: 7777,
	peerName: 'bob',
	kind: 'video',
	paused: false,
	appData: { source: 'webcam' },
	rtpParameters:
	{
		muxId: null,
		codecs:
		[
			{
				name: 'VP8',
				mimeType: 'video/VP8',
				clockRate: 90000,
				payloadType: 100,
				rtcpFeedback:
				[
					{
						parameter: '',
						type: 'nack'
					},
					{
						parameter: 'pli',
						type: 'nack'
					},
					{
						parameter: '',
						type: 'goog-remb'
					},
					{
						parameter: 'bar',
						type: 'foo'
					}
				],
				parameters: {}
			},
			{
				name: 'rtx',
				mimeType: 'video/rtx',
				clockRate: 90000,
				payloadType: 101,
				rtcpFeedback: [],
				parameters: {
					apt: 100
				}
			}
		],
		headerExtensions:
		[
			{
				kind: 'video',
				uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
				id: 11
			},
			{
				kind: 'video',
				uri: 'http://foo.bar',
				id: 12
			}
		],
		encodings:
		[
			{
				ssrc: 777777771,
				rtx: {
					ssrc: 777777772
				}
			}
		],
		rtcp:
		{
			cname: 'BOBCNAME',
			reducedSize: true,
			mux: true
		}
	}
};

exports.BOB_MIC_CONSUMER_PAUSED_NOTIFICATION =
{
	method: 'consumerPaused',
	notification: true,
	id: 6666,
	peerName: 'bob'
};

exports.ALICE_WEBCAM_CONSUMER_PAUSED_NOTIFICATION =
{
	method: 'consumerPaused',
	notification: true,
	id: 4444,
	peerName: 'alice'
};

exports.ALICE_WEBCAM_CONSUMER_RESUMED_NOTIFICATION =
{
	method: 'consumerResumed',
	notification: true,
	id: 4444,
	peerName: 'alice'
};
