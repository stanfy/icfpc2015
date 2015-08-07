 #!/bin/bash
 export API_TOKEN="zSbouMJS0cYhLXgghheLt9alzo8aAHtpku9hiWAVR6U="
 export TEAM_ID="6"
 curl --user :${API_TOKEN} -X "POST" -H "Content-Type: application/json" \
        --data-binary @$1 \
        -v \
        "https://davar.icfpcontest.org/teams/${TEAM_ID}/solutions"