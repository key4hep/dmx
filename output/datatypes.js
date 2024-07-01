export const datatypes = {
  "edm4hep::MCParticle": {
    "members": [
      {
        "name": "PDG"
      },
      {
        "name": "generatorStatus"
      },
      {
        "name": "simulatorStatus"
      },
      {
        "name": "charge"
      },
      {
        "name": "time",
        "unit": "ns"
      },
      {
        "name": "mass",
        "unit": "GeV"
      },
      {
        "name": "vertex",
        "unit": "mm"
      },
      {
        "name": "endpoint",
        "unit": "mm"
      },
      {
        "name": "momentum",
        "unit": "GeV"
      },
      {
        "name": "momentumAtEndpoint",
        "unit": "GeV"
      },
      {
        "name": "spin"
      },
      {
        "name": "colorFlow"
      }
    ],
    "oneToManyRelations": [
      {
        "type": "edm4hep::MCParticle",
        "name": "parents"
      },
      {
        "type": "edm4hep::MCParticle",
        "name": "daughters"
      }
    ]
  },
  "edm4hep::ParticleID": {
    "members": [
      {
        "name": "type"
      },
      {
        "name": "PDG"
      },
      {
        "name": "algorithmType"
      },
      {
        "name": "likelihood"
      }
    ],
    "oneToOneRelations": [
      {
        "type": "edm4hep::ReconstructedParticle",
        "name": "particle"
      }
    ]
  },
  "edm4hep::Cluster": {
    "members": [
      {
        "name": "type"
      },
      {
        "name": "energy",
        "unit": "GeV"
      },
      {
        "name": "energyError",
        "unit": "GeV"
      },
      {
        "name": "position",
        "unit": "mm"
      },
      {
        "name": "positionError"
      },
      {
        "name": "iTheta"
      },
      {
        "name": "phi"
      },
      {
        "name": "directionError",
        "unit": "mm**2"
      }
    ],
    "oneToManyRelations": [
      {
        "type": "edm4hep::Cluster",
        "name": "clusters"
      },
      {
        "type": "edm4hep::CalorimeterHit",
        "name": "hits"
      }
    ]
  },
  "edm4hep::Track": {
    "members": [
      {
        "name": "type"
      },
      {
        "name": "chi2"
      },
      {
        "name": "ndf"
      },
      {
        "name": "dEdx"
      },
      {
        "name": "dEdxError"
      },
      {
        "name": "radiusOfInnermostHit"
      }
    ],
    "oneToManyRelations": [
      {
        "type": "edm4hep::TrackerHit",
        "name": "trackerHits"
      },
      {
        "type": "edm4hep::Track",
        "name": "tracks"
      }
    ]
  },
  "edm4hep::Vertex": {
    "members": [
      {
        "name": "primary"
      },
      {
        "name": "chi2"
      },
      {
        "name": "probability"
      },
      {
        "name": "position"
      },
      {
        "name": "covMatrix"
      },
      {
        "name": "algorithmType"
      }
    ],
    "oneToOneRelations": [
      {
        "type": "edm4hep::ReconstructedParticle",
        "name": "associatedParticle"
      }
    ]
  },
  "edm4hep::ReconstructedParticle": {
    "members": [
      {
        "name": "PDG"
      },
      {
        "name": "energy",
        "unit": "GeV"
      },
      {
        "name": "momentum",
        "unit": "GeV"
      },
      {
        "name": "referencePoint",
        "unit": "mm"
      },
      {
        "name": "charge"
      },
      {
        "name": "mass",
        "unit": "GeV"
      },
      {
        "name": "goodnessOfPID"
      },
      {
        "name": "covMatrix"
      }
    ],
    "oneToManyRelations": [
      {
        "type": "edm4hep::Cluster",
        "name": "clusters"
      },
      {
        "type": "edm4hep::Track",
        "name": "tracks"
      },
      {
        "type": "edm4hep::ReconstructedParticle",
        "name": "particles"
      }
    ],
    "oneToOneRelations": [
      {
        "type": "edm4hep::Vertex",
        "name": "startVertex"
      }
    ]
  },
  "edm4hep::MCRecoParticleAssociation": {
    "members": [
      {
        "name": "weight"
      }
    ],
    "oneToOneRelations": [
      {
        "type": "edm4hep::ReconstructedParticle",
        "name": "rec"
      },
      {
        "type": "edm4hep::MCParticle",
        "name": "sim"
      }
    ]
  }
}